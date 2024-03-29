import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = false);
    },
    signInFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state) => {
      (state.loading = false), (state.error = false);
    },
    signUpFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    forgotStart: (state) => {
      state.loading = true;
    },
    forgotSuccess: (state) => {
      (state.loading = false), (state.error = false);
    },
    forgotFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    editProfileStart: (state) => {
      state.loading = true;
    },
    editProfileSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = false);
    },
    editProfileFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    signOutSuccess: (state) => {
      (state.loading = false),
        (state.error = false),
        (state.currentUser = null);
    },
    deactiveStart: (state) => {
      state.loading = true;
    },
    deactiveSuccess: (state) => {
      (state.loading = false),
        (state.error = false),
        (state.currentUser = null);
    },
    deactiveFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  signOutSuccess,
  forgotStart,
  forgotSuccess,
  forgotFailure,
  editProfileStart,
  editProfileSuccess,
  editProfileFailure,
  deactiveStart,
  deactiveSuccess,
  deactiveFailure,
} = userSlice.actions;

export default userSlice.reducer;
