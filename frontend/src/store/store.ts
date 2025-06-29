import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import reviewReducer from "./reviewSlice";
import authReducer from "./authSlice"; 


export const store = configureStore({
  reducer: {
    products: productReducer,
    reviews: reviewReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredPaths: ["reviews.reviews.0.createdAt"], 
        ignoredActions: ["reviews/addReview/fulfilled"], 
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;


export default store;
