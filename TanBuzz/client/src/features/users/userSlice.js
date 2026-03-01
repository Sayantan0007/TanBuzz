import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import api from "../../api/axios.js";
const initialState = {
  value: null,
};
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (token) => {
    const { data } = await api.get(`/api/user/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log(data);
    return data.success ? data.user : null;
  },
);
export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ userData, token }) => {
    console.log(userData);
    const { data } = await api.post(`/api/user/update`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    if (data.success) {
      toast.success(data.message);
      return data.user;
    } else {
      toast.error(data.message);
      return null;
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;
