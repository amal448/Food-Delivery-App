import React, { useEffect } from 'react'
import axios from 'axios'
import { server } from '@/helpers/constants'
import { useDispatch } from "react-redux";
import { setUserData } from "@/app/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${server}/api/user/current`, { withCredentials: true });
        if (res.data) {
          dispatch(setUserData(res.data));
        }
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    }

    fetchUser(); // only once on mount
  }, [dispatch]);
};

export default useGetCurrentUser;
