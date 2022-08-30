const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  authUserData: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateAuthUser: (state, { payload }) => {
      state.authUserData = payload;
    },
  },
});

export const { updateAuthUser } = userSlice.actions;
export const getAuthUser = (state) => state.user.authUserData;
export default userSlice.reducer;
