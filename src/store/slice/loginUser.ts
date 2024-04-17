import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {LoginUser} from "../../domain/user";

const initialState: {value: LoginUser | null} = {
    value: null
};

const loginUser = createSlice({
    name: "loginUser",
    initialState,
    reducers: {
        setLoginUser(state, action: PayloadAction<LoginUser | null>) {
            state.value = action.payload;
            return state;
        }
    }
});

export const {setLoginUser} = loginUser.actions;
export default loginUser.reducer;
