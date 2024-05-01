import {configureStore} from "@reduxjs/toolkit";
import loginUser from "./slice/loginUser";
import accessToken from "./slice/accessToken";

export const store = configureStore({
    reducer: {
        loginUser,
        accessToken
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
