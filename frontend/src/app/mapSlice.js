import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    location: {
        lat: null,
        lon: null,
        city: null,
        postcode: null,
        street: null,
        suburb: null
    },
    address: null,
    deliveryboylocation: {
        lat: null,
        lon: null,
        city: null,
        postcode: null,
        street: null,
        suburb: null
    }

}

export const mapSlice = createSlice({
    name: 'map',
    initialState,

    reducers: {
        setLocation: (state, action) => {
            const { lat, lon, postcode, city, street, suburb } = action.payload
            state.location.lat = lat
            state.location.lon = lon
            state.location.city = city
            state.location.postcode = postcode
            state.location.street = street
            state.location.suburb = suburb
        },
        setAddress: (state, action) => {
            // console.log("state", action.payload);

            state.address = action.payload
        },
        setDeliveryBoyLocation: (state, action) => {
            const { lat, lon, postcode, city, street, suburb } = action.payload;

            if (!state.deliveryboylocation) {
                state.deliveryboylocation = {};
            }

            state.deliveryboylocation.lat = lat;
            state.deliveryboylocation.lon = lon;
            state.deliveryboylocation.city = city;
            state.deliveryboylocation.postcode = postcode;
            state.deliveryboylocation.street = street;
            state.deliveryboylocation.suburb = suburb;
        },
         resetMapState: () => initialState  

    },
})

// Action creators are generated for each case reducer function
export const { setLocation,resetMapState, setAddress, setDeliveryBoyLocation } = mapSlice.actions

export default mapSlice.reducer