import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import userReducer from './userSlice.js'
import ownerReducer from './ownerSlice.js'
import mapReducer from './mapSlice.js'

const rootReducer = combineReducers({
  user: userReducer,
  owner: ownerReducer,
  map: mapReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'owner', 'map'], // persist only these reducers
  // or use blacklist: ['map'] if you want to exclude map
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
})

export const persistor = persistStore(store)
