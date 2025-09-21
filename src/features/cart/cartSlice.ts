import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";

type CartState = {
  count: number;
};

const initialState: CartState = {
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    incrementCartCount: (state, action) => {
      state.count += action.payload;
    },
    clearCartCount: (state) => {
      state.count = 0;
    },
  },
});

export const { setCartCount, incrementCartCount, clearCartCount } =
  cartSlice.actions;

export const selectCartCount = (state: RootState) => state.cart.count;

export default cartSlice.reducer;
