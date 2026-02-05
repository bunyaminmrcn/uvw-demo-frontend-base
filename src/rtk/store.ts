import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer
    //event: eventReducer,
    //socket : socketReducer
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;