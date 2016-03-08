import isPlainObject from 'lodash/isPlainObject'

/**
 * private ACs
 */
export var ActionTypes = {
  INIT: '@@redux/INIT'
}

/**
 * Store holds state tree
 *   - .dispatch() changes 
 *   - .combineReducers() -> different changes to one action
 *
 * @param {Function} reducer 
 * @param {any} [initialState] (could be from server, or prev serialized user session)
 * @param {Function} enhancer used for middleware, time-travel, persistence...
 * @returns {Store} Capabilities: read, dispatch, subscribe
 */
export default function createStore(reducer, initialState, enhancer) {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState
    initialState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, initialState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  var currentReducer = reducer
  var currentState = initialState
  var currentListeners = []
  var nextListeners = currentListeners
  var isDispatching = false

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * gets state tree
   */
  function getState() {
    return currentState
  }

  /**
   * Change listener: called any time an action is dispatched
   *   often used with getState
   *
   * Can call dispatch from a listener:
   *   - guarantee: 
   *     - all subscribers registered before a dispatch will be called with latest state
   *     - subsriptions snapshooted BEFORE dispatch call: issues with nesting
   *   - listener shouldn't see all state changes: 
   *     - nested dispatch call: (inside listener) can update multiple times
   *
   * @param {Function} listener - callback, invoked on every dispatch.
   * @returns {Function} a function to remove the listener
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    var isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      var index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * DISPATCH:
   *   - only way to trigger state change
   *   - reducer will be given dispatched action
   *     - reducer's return value is the new state tree
   *     - change listeners then notified
   *   - Basic: plain object actions
   *     - Wrap createStore into middleware for Promise, Observable, thunk, etc
   *       - e.g. redux-thunk: middleware dispatches plain objects anyway
   *
   * @param {Object} - describes what changed
   *        - keep serializable for hot reload
   *        - must have "type" prop, a string
   * @returns {Object} For convenience, same action
   *                       - or a promise, etc, using middleware
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    var listeners = currentListeners = nextListeners
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }

    return action
  }

  /**
   * for code replitting or hot reloading
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  // When a store is created, an "INIT" action is dispatched.
  // every reducer returns initial state, populating the tree
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer
  }
}