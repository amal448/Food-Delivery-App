import React, { useEffect } from 'react'
import axios from 'axios'
import { server } from '@/helpers/constants'
import { useSelector, useDispatch } from "react-redux";
import { setMyShopData } from '@/app/ownerSlice';

const UseGetMyShop = () => {
    
    const dispatch = useDispatch()
    useEffect(() => {
        async function fetchShop() {
            try {
                const res = await axios.get(`${server}/api/shop/get-my`, { withCredentials: true })
                dispatch(setMyShopData(res.data))
            }
            catch (error) {
                console.log(error);

            }
        }
        fetchShop()
    }, [])

}

export default UseGetMyShop