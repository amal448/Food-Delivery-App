import { setAddress, setLocation } from "@/app/mapSlice";
import { server } from "@/helpers/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

//initially lat and long of user's current is fetched using geolocation
//NOTE THIS AUTOMATIC LAT AND LONG MAY CAUSE ERROR

function useUpdateLocation() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const { deliveryboylocation } = useSelector(state => state.map)

    useEffect(() => {
        const updateLocation = async (lat, lon) => {
            const result = await axios.post(`${server}/api/user/update-location`, { lat, lon },
                { withCredentials: true })
        }
        if (deliveryboylocation && userData?.role === "deliveryBoy") {
            updateLocation(deliveryboylocation.lat, deliveryboylocation.lon)
        }
        else {
            navigator.geolocation.watchPosition((pos) => {
                updateLocation(pos.coords.latitude, pos.coords.longitude)
            })
        }
    }, [userData,deliveryboylocation])

}
export default useUpdateLocation