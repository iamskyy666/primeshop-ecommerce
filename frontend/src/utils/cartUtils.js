// helper fn to format prices
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
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

  return state;
};
