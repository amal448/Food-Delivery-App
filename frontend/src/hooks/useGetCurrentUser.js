import React, { useEffect } from 'react'
import axios from 'axios'
import { server } from '@/helpers/constants'
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "@/app/userSlice";

const useGetCurrentUser = () => {
    
    const dispatch = useDispatch()
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get(`${server}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(res.data))
            }
            catch (error) {
                console.log(error);

            }
        }
        fetchUser()
    }, [])

}

export default useGetCurrentUser