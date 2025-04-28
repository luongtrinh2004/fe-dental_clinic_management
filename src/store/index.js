// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import settings from 'src/store/apps/settings'

export const store = configureStore({
  reducer: {
    settings
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
