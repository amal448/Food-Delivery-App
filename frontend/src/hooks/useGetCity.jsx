import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import { setCity } from "@/app/userSlice";
import { setLocation, setAddress } from '@/app/mapSlice';

const useGetCity = () => {
  // console.log("hiiiii", "useGetCity");

  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { location } = useSelector((state) => state.map);

  useEffect(() => {
    if (location?.city && location?.lat && location?.lon) {
      // console.log("🟡 Skipping useGetCity — location already exists:", location.city);
      return;
    }
    // 🔹 Make sure user is truly loaded
    if (!userData || !userData._id) return;

    const fetchLocation = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          dispatch(setLocation({ lat: latitude, lon: longitude }));

          const { data } = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
          );

          const result = data?.results?.[0];
          if (!result) return;
          // console.log("SetCity,setLocation", result.city, result.lat, result.lon);

          dispatch(setCity(result.city));
          dispatch(setLocation({
            lat: result.lat,
            lon: result.lon,
            city: result.city,
            postcode: result.postcode,
            street: result.street,
            suburb: result.suburb
          }));
          dispatch(setAddress(result.address_line2));
        });
      } catch (error) {
        console.error("Location fetch failed:", error);
      }
    };

    fetchLocation();
  }, [userData?._id]); // ✅ depends on stable, primitive value (avoids reruns)
};

export default useGetCity;
