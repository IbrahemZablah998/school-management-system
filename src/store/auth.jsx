import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialAuthState = {
  userInformation: Cookies.get('userInformation'),
  userRole: '',
  teachersMajor: '',
};

const authSlice = createSlice({
  name: "AUTHENTICATION",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      Cookies.set('userInformation', (action.payload), { expires: new Date(Date.now() + (18000000)) });
      state.userInformation = Cookies.get('userInformation');
    },
    logout(state, action) {
      Cookies.remove(action.payload);
      state.userInformation = Cookies.get('userInformation');
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setTeachersMajor(state, action) {
      state.teachersMajor = action.payload;
    }
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
