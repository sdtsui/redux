createFluxStore(reducer)
  - compatible with your existing app from a reducer function.
  - dispatch handler: calls reducer for any (ALL?) actions... (store state/emit change)

graduate rewrite:
  - export createFluxStore(reducer), so rest of app is not aware: still sees Flux Stores.

Antipatterns to avoid:
  - fetching API in store
  ** ** -- Trigger state change in Redux w/ Dispatch
          - fetch is done with promise: (in example: isomorphic-fetch), state change triggered on dispatch
        -- All state changes happen in reducers
  - triggering actions in stores

Replacing Flux:
  - Single redux Store using combineReducers(reducers)
  - port UI to use react-redux bindings
  - start experimenting with middleware

ExampleCreateStore Notes :
 Takeaways:
  ** CreateStore can completely replace PCPViewStore ** 
  ** How can I refactor all of the current actionCreator functionality,
    - to invoke dispatch on Store? ** 

  ___________________
  ___________________
  ___________________
  ___________________


_____________________________________
Examples:
  Todos:  (Container Components)
    - Provider store = createStore(reducers)
    - reducers = combineReducers({todos, visibilityFilter}) , as todoApp
    - tests start from actions and reducers : 

  Todo-Update:  (wrapping w/ Redux Undo)
    (container, passed into connect) : 
    UndoRedo = connect(
      mapStateToProps,
      mapDispatchToProps
    )(UndoRedo)

    reducer (react undo):
      const undoableTodos = undoable(todos, {
        filter: distinctState()
      })
      export default undoableTodos

  Async:  (Redux Thunk) 
    //thunk example:

    function fetchPosts(reddit) {
      return dispatch => {
        dispatch(requestPosts(reddit))
        return fetch(`https://www.reddit.com/r/${reddit}.json`)
          .then(response => response.json())
          .then(json => dispatch(receivePosts(reddit, json)))
      }
    }

    function shouldFetchPosts(state, reddit) {
      const posts = state.postsByReddit[reddit]
      if (!posts) {
        return true
      }
      if (posts.isFetching) {
        return false
      }
      return posts.didInvalidate
    }

    export function fetchPostsIfNeeded(reddit) {
      return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), reddit)) {
          return dispatch(fetchPosts(reddit))
        }
      }
    }




  Shopping Cart : (compose reducers, define selectors)
  //define selectors alongside the reducers: knowledge about state shape is encapsulated.
    //reducers index.js, reducer
    export function getTotal(state) {
      return getAddedIds(state.cart).reduce((total, id) =>
        total + getProduct(state.products, id).price * getQuantity(state.cart, id),
        0
      ).toFixed(2)
    }

    export function getCartProducts(state) {
      return getAddedIds(state.cart).map(id => Object.assign(
        {},
        getProduct(state.products, id),
        {
          quantity: getQuantity(state.cart, id)
        }
      ))
    }

    // products.js, reducer
    export default combineReducers({
      cart,
      products
    })


    export default combineReducers({
      byId,
      visibleIds
    })

    export function getProduct(state, id) {
      return state.byId[id]
    }

    export function getVisibleProducts(state) {
      return state.visibleIds.map(id => getProduct(state, id))
    }