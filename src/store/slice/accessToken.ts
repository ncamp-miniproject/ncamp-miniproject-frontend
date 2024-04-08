import {PayloadAction, createSlice} from "@reduxjs/toolkit";

const initialState: {value: string | null} = {
    value: null
};

const accessToken = createSlice({
    name: "accessToken",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string | null>) {
            state.value = action.payload;
            return state;
        }
    }
});

export const {setAccessToken} = accessToken.actions;
export default accessToken.reducer;
