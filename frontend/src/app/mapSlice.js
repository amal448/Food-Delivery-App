import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    location: {
        lat: null,
        lon: null
    },
    address:null
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,

    reducers: {
        setLocation:(state,action)=>{
            const {lat,lon}=action.payload
            state.location.lat=lat
            state.location.lon=lon
        },
        setAddress:(state,action)=>{
            console.log("state",action.payload);
            
            state.address=action.payload
        }

    },
})

// Action creators are generated for each case reducer function
export const {setLocation,setAddress } = mapSlice.actions

export default mapSlice.reducer