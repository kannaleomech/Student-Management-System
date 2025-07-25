import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../api/axios";
import { jwtDecode } from "jwt-decode";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await Api.post("/auth/login", credentials);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await Api.post("/auth/register", userData);
      return data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

const token = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: token ? jwtDecode(token) : null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token } = action.payload;
        state.token = token;
        state.user = jwtDecode(token);
        state.success = true;
        localStorage.setItem("token", token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const { token } = action.payload;
        state.token = token;
        state.user = jwtDecode(token);
        state.success = true;
        localStorage.setItem("token", token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
