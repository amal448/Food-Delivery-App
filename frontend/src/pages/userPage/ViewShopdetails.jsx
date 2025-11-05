import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios';
import { server } from '@/helpers/constants';
import { Skeleton } from '@/components/ui/skeleton';
import ItemsCard from '@/components/usercomponents/ItemsCard';
import { Separator } from '@/components/ui/separator';

const ViewShopdetails = () => {
  const [shopItems, setShopItems] = useState([]);
  const { shopId } = useParams();
  const [loading, setLoading] = useState(true);

  const handleGetOrder = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${server}/api/item/get-items/${shopId}`, { withCredentials: true });
      setShopItems(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [shopId]);
  // console.log(shopItems);

  return (
    <div className="min-h-screen bg-background">
      {/* 🌟 Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary/80">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${shopItems[0]?.shop?.image})` }}
        />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl  font-bold mb-2">{shopItems[0]?.shop?.name}</h1>
            <p className="text-lg opacity-90">Delicious food delivered to your door</p>
          </div>
        </div>
      </div>

      {/* 🌮 Items Grid Section */}
      <div className="max-w-7xl mx-auto  py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-60 w-full rounded-xl" />
            ))}
          </div>
        ) : shopItems && shopItems.length > 0 ? (
          <>

            <h4 className="text-xl md:text-4xl text-center px-4  py-2 font-bold mb-2">Restaurant Menu</h4>
            <Separator className='mb-4 border-2 border-green-200' />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">

              {shopItems.map((item) => (
                <ItemsCard key={item._id} data={item} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg">No items available for this shop.</p>
        )}
      </div>
    </div>
  );
};

export default ViewShopdetails;
