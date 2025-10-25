


import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setCity } from "@/app/userSlice";
import { setLocation, setAddress } from '@/app/mapSlice';

const useGetCity = () => {

    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)

    useEffect(() => {
        function fetch() {

            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                dispatch(setLocation({ lat: latitude, lon: longitude }))

                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)
                dispatch(setCity(result?.data?.results[0]?.city))
                console.log("result",result?.data?.results[0]?.lat,result?.data?.results[0]?.lon);
                dispatch(setLocation({ lat: result?.data?.results[0]?.lat, lon: result?.data?.results[0]?.lon }))
                console.log("result", result?.data.results[0]?.address_line2);
                dispatch(setAddress(result?.data?.results[0]?.address_line2))

            })
        }
        fetch()
    }, [userData])

}

export default useGetCity




// import React, { useEffect } from 'react'
// import axios from 'axios'
// import { useSelector, useDispatch } from "react-redux";
// import { setCity } from "@/app/userSlice";
// import { server } from '@/helpers/constants';

// const useGetCity = () => {

//     const dispatch = useDispatch()
//     const { userData } = useSelector((state) => state.user)

//     useEffect(() => {
//      async function fetch() {

//             navigator.geolocation.getCurrentPosition(async (position) => {
//                 const latitude = position.coords.latitude
//                 const longitude = position.coords.longitude

//                 // const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)
//                 // dispatch(setCity(result?.data?.results[0]?.city))
//                 const { data } = await axios.post(`${server}/api/location/reverse-geocode`, {
//                     lat: latitude,
//                     lon: longitude,
//                 });
//                 console.log("City:", data.city);
//             })
//         }
//         fetch()
//     }, [userData])

// }

// export default useGetCity


