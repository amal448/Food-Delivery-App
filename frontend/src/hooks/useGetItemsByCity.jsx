import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setItemsByCity } from "@/app/userSlice";
import { server } from '@/helpers/constants';
import { useLoading } from '@/context/LoadingContext';

const useGetItemsByCity = () => {
    const dispatch = useDispatch()
    const { city } = useSelector((state) => state.user)
    const { setLoading } = useLoading();
    const [citydata, setCityData] = useState(null)
    const [isEmpty, setIsEmpty] = useState(false) // ✅ new flag

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true); 
                const res = await axios.get(`${server}/api/item/shop-items/${city}`, {
                    withCredentials: true,
                });
                console.log("res", res.data);

                setCityData(res.data)
                dispatch(setItemsByCity(res?.data));

                // ✅ check if response is empty array
                setIsEmpty(res.data.length === 0);

            } catch (error) {
                console.error("Error fetching items by city:", error);
                setIsEmpty(true); // optional: show alert if request fails
            } finally {
                setLoading(false); 
            }
        }

        if (city) fetchData();
    }, [city]);

    return { isEmpty } // return the flag to component
}

export default useGetItemsByCity
