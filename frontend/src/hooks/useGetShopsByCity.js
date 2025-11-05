import { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setShopByCity } from "@/app/userSlice";
import { server } from '@/helpers/constants';

const useGetNearByShops = () => {
    const dispatch = useDispatch();
    const { location } = useSelector((state) => state.map);
    const { city } = useSelector((state) => state.user);

    useEffect(() => {
        async function fetchNearbyShops() {
            try {
                if (!location?.lat || !location?.lon) return; // Prevent running before data exists
                const res = await axios.get(
                    `${server}/api/shop/nearby?lat=${location.lat}&lng=${location.lon}`,
                    { withCredentials: true }
                );
                dispatch(setShopByCity(res?.data));
            } catch (error) {
                console.error("Error fetching nearby shops:", error);
            }
        }

        fetchNearbyShops();
    }, [city, location?.lat, location?.lon]); 
    // triggers when city or location changes
};

export default useGetNearByShops;
