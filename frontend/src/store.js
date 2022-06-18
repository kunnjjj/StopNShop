import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer,productDetailsReducer } from './reducers/productReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails:productDetailsReducer
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store

// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import { configureStore } from '@reduxjs/toolkit'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import { productListReducer } from './reducers/productReducers'

// const reducer = combineReducers({
//     productList: productListReducer
// })

// const initialState = {}

// const middleware = [thunk]

// const store = configureStore({
//     reducer:{
//       productListReducer,
//     },
// })


// export default store

// import { applyMiddleware, combineReducers,createStore } from 'redux'
// import { configureStore } from '@reduxjs/toolkit'
// import thunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension'
// import { productListReducer } from './reducers/productReducers'
// const reducer = combineReducers({
//     productList: productListReducer,
// })

// const initialState = {}

// const middleware = [thunk]

// const store = configureStore({
//     reducer:{productList:productListReducer},
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
// })


// export default store