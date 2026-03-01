import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../features/connections/connectionSlice.js";
import messageReducer from "../features/messages/messageSlice.js";
import userReducer from "../features/users/userSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionReducer,
    messages: messageReducer,
  },
});
export default store;
