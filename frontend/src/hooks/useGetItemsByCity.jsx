import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setItemsByCity } from "@/app/userSlice";
import { server } from '@/helpers/constants';
import { useLoading } from '@/context/LoadingContext';

const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const { city } = useSelector((state) => state.user)
    const { location } = useSelector((state) => state.map)
    const { setLoading } = useLoading();
    const [citydata, setCityData] = useState(null)
    const [isEmpty, setIsEmpty] = useState(false) // ✅ new flag
    const { userData } = useSelector((state) => state.user)

    useEffect(() => {
        if (userData) {
            async function fetchData() {

                try {
                    setLoading(true);

                    const res = await axios.get(`${server}/api/item/shop-items/${city}?lat=${location?.lat}&lng=${location?.lon}`, {
                        withCredentials: true,
                    });
                    // console.log("useGetItemsByCity",res);
                    
                    setCityData(res.data)
                    dispatch(setItemsByCity(res?.data));

                    // ✅ check if response is empty array
                    setIsEmpty(res.data.length === 0);

                } catch (error) {
                    console.error("Error fetching items by city:", error);
                    setIsEmpty(true); // optional: show alert if request fails
                     dispatch(setItemsByCity(null));
                } finally {
                    setLoading(false);
                }
            }

            if (city) fetchData();
        }
    }, [city, location, userData]);

    return { isEmpty } // return the flag to component
}

export default useGetItemsByCity
