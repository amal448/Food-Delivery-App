import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setShopByCity } from "@/app/userSlice";
import { server } from '@/helpers/constants';

const useGetNearByShops = () => {

    const dispatch = useDispatch()
    const { city } = useSelector((state) => state.user)

    useEffect(() => {
        async function fetch() {
            const res = await axios.get(`${server}/api/shop/shop-by-city/${city}`, { withCredentials: true })
            dispatch(setShopByCity(res?.data))
            
        }
        fetch()
    }, [city])

}

export default useGetNearByShops


