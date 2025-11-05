import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: null,
  city: null,
  ItemByCity: null,
  NearByShop: null,
  CartItems: [],
  SearchItems:[],
  CartCount: 0,
  TotalPrice: 0,
  myOrders: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setCity: (state, action) => {
      // console.log("action.payload",action.payload);

      state.city = action.payload
    },
    setItemsByCity: (state, action) => {
      // console.log("setItemsByCity",action.payload);
      
      state.ItemByCity = action.payload
    },
    setShopByCity: (state, action) => {
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
      state.TotalPrice = state.CartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0)
    },
    removeCartItems: (state, action) => {
      const deleteItem = action.payload;
      // console.log(deleteItem);

      state.CartItems = state.CartItems.filter(item => item.id !== deleteItem.id);

      state.CartCount = state.CartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.TotalPrice = state.CartItems.reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0)
    },

    updateCartQuantity: (state, action) => {
      const update = action.payload;
      // console.log(update);

      const updateItem = state.CartItems.find(item => item.id == update.id);
      //  console.log("updateItem",updateItem);

      updateItem.quantity = update.quantity

      state.CartCount = state.CartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.TotalPrice = state.CartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders]
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      console.log("updateOrderStatus", action.payload);

      console.log("redux", JSON.parse(JSON.stringify(state.myOrders)));
      const order = state.myOrders.find(o => o.orderId === orderId);

      if (order) {
        if (order.shopOrder && order.shopOrder.shop._id === shopId) {
          order.shopOrder.status = status
        }
      }
    },
    clearCart: (state) => {
      console.log("clearCart");

      state.CartItems = [];
      state.CartCount = 0;
      state.TotalPrice = 0;
    },
    logoutUser: () => initialState, //

    setSearchItem:(state,action)=>{
        state.SearchItems = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserData, setMyOrders, updateOrderStatus,setSearchItem, logoutUser, clearCart, addMyOrder, setCity, setItemsByCity, setShopByCity, setCartItems, removeCartItems, updateCartQuantity } = userSlice.actions

export default userSlice.reducer