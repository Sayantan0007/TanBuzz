import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  connection: [],
  followers: [],
  following: [],
  pendingConnections: [],
};
export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (token) => {
    const { data } = await api.get("/api/user/getconnections", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.success ? data : null;
  },
);
const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConnections.fulfilled, (state, action) => {
      if (action.payload) {
        state.connection = action.payload.connections;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
        state.pendingConnections = action.payload.pendinConnectionRequests;
      }
    });
  },
});

export default connectionSlice.reducer;
