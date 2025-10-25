import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: null,
  city: null,
  ItemByCity: null,
  NearByShop: null,
  CartItems: [],
  CartCount: 0
}

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setCity: (state, action) => {
      console.log("action.payload",action.payload);
      
      state.city = action.payload
    },
    setItemsByCity: (state, action) => {
      state.ItemByCity = action.payload
    },
    setShopByCity: (state, action) => {
      // console.log("action.payload", action.payload);

      state.NearByShop = action.payload
    },
    setCartItems: (state, action) => {
      const newItem = action.payload;

      const existing = state.CartItems.find(item => item.id === newItem.id);

      if (existing) {
        existing.quantity = newItem.quantity;
      } else {
        state.CartItems.push(newItem);
      }

      state.CartCount = state.CartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },
    removeCartItems: (state, action) => {
      const deleteItem = action.payload;
      console.log(deleteItem);

      state.CartItems = state.CartItems.filter(item => item.id !== deleteItem.id);

      state.CartCount = state.CartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    updateCartQuantity: (state, action) => {
      const update = action.payload;
      console.log(update);

      const updateItem = state.CartItems.find(item => item.id == update.id);
     console.log("updateItem",updateItem);
     
      updateItem.quantity = update.quantity

      state.CartCount = state.CartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },



  },
})

// Action creators are generated for each case reducer function
export const { setUserData, setCity, setItemsByCity, setShopByCity, setCartItems, removeCartItems,updateCartQuantity } = userSlice.actions

export default userSlice.reducer