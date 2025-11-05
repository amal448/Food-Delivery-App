import React, { useEffect } from 'react'
import axios from 'axios'
import { server } from '@/helpers/constants'
import { useSelector, useDispatch } from "react-redux";
import { setMyOrders } from '@/app/userSlice';

const UseGetMyOrders = () => {
    
    const dispatch = useDispatch()
    useEffect(() => {
        async function fetchMyOrder() {
            try {
                const res = await axios.get(`${server}/api/order/my-orders`, { withCredentials: true })
                // console.log("UseGetMyOrders",res);
                
                dispatch(setMyOrders(res.data))
                // console.log(res.data);
                
            }
            catch (error) {
                console.log(error);

            }
        }
        fetchMyOrder()
    }, [])

}

export default UseGetMyOrders