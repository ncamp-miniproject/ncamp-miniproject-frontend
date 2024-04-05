import { configureStore } from "@reduxjs/toolkit";
import loginUser from "./slice/loginUser";

export const store = configureStore({
    reducer: {
        loginUser
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;