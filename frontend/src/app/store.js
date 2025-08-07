import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';


// ストアには複数のreducerを登録できる
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});