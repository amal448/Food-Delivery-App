import DeliveryBoyTracking from '@/components/DeliveryBoyTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { server } from '@/helpers/constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const TrackOrderPage = () => {
  const { orderId } = useParams()
  const [currentOrder, setCurrentOrder] = useState()

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${server}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
      console.log(result.data);
      setCurrentOrder(result.data)

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOrder()
  }, [orderId])
console.log("currentOrder",currentOrder?.deliveryAddress?.latitude
  // ?
  // .latitude,
  //                 currentOrder?.deliveryAddress?.longitude
                  ,);

  return (
    <div>

      {
        currentOrder?.shopOrder.map((shopOrder, index) => (
          <div className=''>
            <Card className="w-full border border-green-200 bg-green-50 hover:shadow-md transition-shadow duration-300 rounded-2xl mt-4">
              <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 space-y-4 md:space-y-0 w-full">
                <div className="flex items-center gap-4">
                  {/* <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-lg">
                    {shopOrder.assignedDeliveryBoy.fullName.charAt(0).toUpperCase()}
                  </div> */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {shopOrder?.shop?.name}
                    </h4>
                    {
                      shopOrder.shopOrderItems.map((item) => (
                        <div className='mb-2'>
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-lg ">
                            <img className='rounded' src={item?.item?.image} alt="" />
                          </div>
                          <p className="text-sm text-gray-600">{item.item
                            .name}</p>
                          <p className="text-sm text-gray-600">{item.item
                            .price} * {item.
                              quantity}</p>

                        </div>
                      ))
                    }
                    <p className="text-sm text-gray-600 font-bold"> SubTotal{' '}:{shopOrder.
                      subtotal}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✅ Assigned Delivery Partner
                    </p>
                  </div>
                </div>
                <div>
                  <div className='mb-2'>
                    <p>OrderID:{' '}{currentOrder._id}</p>
                    <p>ShopOrderID:{' '}{shopOrder._id}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 transition-all"
                  >
                    {shopOrder?.status}
                  </Button>

                </div>
              </CardContent>
            </Card>
            {
              (shopOrder.assignedDeliveryBoy && shopOrder.status!="delivered")
              &&
              <DeliveryBoyTracking data={{
                deliveryBoyLocation: {
                  lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                  lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                },
        
                customerLocation:{
                  lat:currentOrder?.deliveryAddress?.latitude,
                  lon:currentOrder?.deliveryAddress?.longitude,
                },
              }} />
            }
          </div>
        ))
      }



    </div>
  )
}

export default TrackOrderPage