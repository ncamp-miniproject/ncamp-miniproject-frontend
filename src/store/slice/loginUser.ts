import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../../domain/user";

const initialState: {value: User} = {
    value: {
        userId: "userId",
        userName: "sampleName",
        password: "samplePassword",
        email: "sampleEmail"
    }
};

const loginUser = createSlice({
    name: "loginUser",
    initialState,
    reducers: {
        setLoginUser(state, action: PayloadAction<User>) {
            state = {...state, ...action.payload};
            return state;
        }
    }
});

export const {setLoginUser} = loginUser.actions;
export default loginUser.reducer;