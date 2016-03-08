Migration Notes.md


ToGrok:
- Migration Text
- Example Text

React Redux : Performant bindings
  - don't rerender if shallow equasl(?)
  Screencast: 
  https://www.youtube.com/watch?v=VJ38wSFbM3A


- Book Jacky's Lightning Talk < --- > Saturday OS.
____________________
____________________
____________________
Examples to review:
____________________
____________________
____________________

*TODOs - how state updates work together with components in Redux
*Todos with Undo - wrapping reducer with Redux Undo, for undo/redo functonality


*Shopping Cart: Idiomatic Redux patterns: important as app grows:
  - normalized store, by Id
  - compose reducers on several levels
  - define selectors alongside reducers so knowledge about state shape is encapsulated
  - Middleware: Redux Logger, and Redux Thunk


Async: with Redux Thunk
  - fetching data in response to user input
  - loading indicators
  - caching responses, invalidating cache

--- Breakpoint for PCP, normalized store not needed, thunk needed --- 

*Tree View: demos rendering a deeply nested tree view, representing state in normalized form so it is easier to update from reducers
  - granular subscription of container components
Universal : server rendering -- prepare state on server, boot from state on client
http://redux.js.org/docs/recipes/ServerRendering.html
Real World: 
  - store fetched entities in normalized cache
  - custom middleware for API calls
  - render partially loaded data
  - pagination
  - caching responses
  - error messages
  - routing
  - Redux DevTools
