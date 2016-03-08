createFluxStore(reducer)
  - compatible with your existing app from a reducer function.
  - dispatch handler: calls reducer for any (ALL?) actions... (store state/emit change)

graduate rewrite:
  - export createFluxStore(reducer), so rest of app is not aware: still sees Flux Stores.

Antipatterns to avoid:
  - fetching API in store
  - triggering actions in stores

Replacing Flux:
  - Single redux Store using combineReducers(reducers)
  - port UI to use react-redux bindings
  - start experimenting with middleware

ExampleCreateStore Notes :
 Takeaways: