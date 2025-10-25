import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMyShopItems } from "@/app/ownerSlice";
import { server } from "@/helpers/constants";

export default function UseGetShopItems(shopId) {
  const dispatch = useDispatch();

  const fetchItems = async () => {
    console.log("shopId",shopId);
    
    if (!shopId) return;
    try {
      const res = await axios.get(`${server}/api/item/get-items/${shopId}`, {
        withCredentials: true,
      });
      console.log("res.data.items ",res.data );
      
      dispatch(setMyShopItems(res.data || []));
    } catch (error) {
      console.error("Failed to fetch shop items:", error);
    }
  };

  // fetch once when mounted
  useEffect(() => {
    fetchItems();
  }, [shopId]);

  // return fetch function for manual refresh
  return { fetchItems };
}
