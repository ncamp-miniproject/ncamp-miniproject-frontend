import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {Role, User} from "../../domain/user";

const initialState: {value: User | null} = {
    value: null
};

const loginUser = createSlice({
    name: "loginUser",
    initialState,
    reducers: {
        setLoginUser(state, action: PayloadAction<User | null>) {
            state = {...state, ...action.payload};
            return state;
        }
    }
});

export const {setLoginUser} = loginUser.actions;
export default loginUser.reducer;
