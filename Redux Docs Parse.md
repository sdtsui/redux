Following in the steps of: 
  - Flux, 
  - CQRS, and 
  - Event Sourcing, 

Redux: imposes restrictions on when state updates can happen. 
  - Truth
  - Read-Only
  - Pure

Prior Art:
  - Flux
    - no concept of dispatcher
    - assumes you never mutate your data
    - Om's Example: 
      - memory, object allocation
      + avoiding re-renders and caluclations
  - Elm: language, inspired by Haskell; Consider:
    - https://github.com/evancz/elm-architecture-tutorial/
    - Playground    https://github.com/paldepind/noname-functional-frontend-framework
    - Flow : https://github.com/reactjs/redux/issues/290
  - Immutable: orthogonal to redux
    - reselect/selectors: composable getter functions
  - Baobab: immutable alternative, no structural sharing, don't use it
  - Rx/Reactive Extensions/Cycle:
    - "superb way to manage the complexity of asynchronous apps"
    - could expose a redux store as an observable
    - could compose async streams, turn them into actions, feed them into store.dispatch()

Ecosystem : [see doc]

