import { EmptyFile } from '@/components/ownercomponents/EmptyFile'
import React , {useEffect}from 'react'
import { Button } from '@/components/ui/button'
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { AddShop } from '@/components/ownercomponents/AddShop';
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import ListShops from '@/components/ownercomponents/ListShops';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '@/app/ownerSlice';
import axios from 'axios';
import { server } from '@/helpers/constants';

const Myshop = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const shop = useSelector((state) => state?.owner?.myShopData)
   const fetchShop = async () => {
    try {
      const res = await axios.get(`${server}/api/shop/get-my`, { withCredentials: true });
      dispatch(setMyShopData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);
  return (
    <div className='px-2 md:px-6 py-8 '>
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-semibold text-start ">View Shops</h1>
        <Sheet>
          <AddShop refreshShops={fetchShop} />
        </Sheet>
      </div>
      <ListShops shop={shop} />
      {/* <EmptyFile /> */}
    </div>
  )
}

export default Myshop