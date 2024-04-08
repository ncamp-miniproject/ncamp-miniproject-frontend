import {PayloadAction, createSlice} from "@reduxjs/toolkit";

export type Metadata = {
    apiUrl?: string;
};

const initialState: Metadata = {};

const metadata = createSlice({
    name: "metadata",
    initialState,
    reducers: {
        setMetadata(state, action: PayloadAction<Metadata>) {
            state = action.payload;
            return state;
        }
    }
});

export const {setMetadata} = metadata.actions;
export default metadata.reducer;
