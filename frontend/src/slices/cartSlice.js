import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
    };

// helper fn to format prices
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existsItem = state.cartItems.find((i) => i._id === item._id);
      if (existsItem) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === existsItem._id ? item : i,
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // calculate item's price
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
      );

      // calculate shipping price (If order is over $100, then FREE else $10)
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

      // calculate tax price (15% tax)
      state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));

      // calculate total price
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      // save it in localStorage
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
