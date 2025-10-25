  import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  myShopData: null,
  myShopItems: null,

}

export const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  
  reducers: {
    setMyShopData:(state,action)=>{
        state.myShopData=action.payload
    },
    setMyShopItems:(state,action)=>{
        state.myShopItems=action.payload
    },
  
  },
})

// Action creators are generated for each case reducer function
export const { setMyShopData,setMyShopItems} = ownerSlice.actions

export default ownerSlice.reducer