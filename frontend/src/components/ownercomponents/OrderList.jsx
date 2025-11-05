import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { server } from '@/helpers/constants';
import axios from 'axios';
import { updateOrderStatus } from '@/app/userSlice';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const OrderList = () => {
  const [statusMap, setStatusMap] = useState({});
  const [availableBoys, setAvailableBoys] = useState([]);

  const dispatch = useDispatch();
  const boxIcon = "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";
  const orders = useSelector(state => state.user.myOrders);

  const handleUpdateStatus = async (orderId, shopId, status) => {
    console.log("orderId, shopId, status", orderId, shopId, status);
    try {
      const result = await axios.post(
        `${server}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
      setAvailableBoys(result?.data?.availableBoys);
      console.log("resultt", result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="md:p-10 p-4 space-y-6 w-full">
      <h2 className="text-lg font-medium text-gray-800">Orders List</h2>

      {orders.map((order, index) => (
        <div
          key={index}
          className="flex flex-col w-full md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-gray-300 text-gray-800 bg-white shadow-sm"
        >
          {/* Items Section */}
          <div className="flex gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
            <div className="flex flex-col justify-center">
              {order?.shopOrder?.shopOrderItems?.map((item, i) => (
                <p key={i} className="font-medium">
                  {item.item.name}{" "}
                  <span className="text-indigo-500">
                    {item.quantity} x {item.item.price}
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* Address & Payment */}
          <div className="font-medium mb-1 text-sm">
            <p>{order.user.fullName}</p>
            <p>{order.user.mobile}</p>
            <p className="font-medium mb-1">{order.deliveryAddress?.text}</p>
            <p>{order.paymentMethod}</p>
          </div>

          {/* Total */}
          <p className="font-medium text-base my-auto text-black/70">
            ₹{order?.shopOrder?.subtotal}
          </p>

          {/* Meta Info */}
          <div className="flex flex-col gap-3 text-sm">
            <p>Method: <span className='uppercase font-bold'>{order.paymentMethod}</span></p>
            <p>Date: {new Date(order.shopOrder.createdAt).toLocaleDateString()}</p>
            <p>Status: {order?.shopOrder?.status}</p>

            <NativeSelect
              value={statusMap[order.shopOrder._id] || order.shopOrder?.status || ""}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatusMap((prev) => ({
                  ...prev,
                  [order.shopOrder._id]: newStatus
                }));
                handleUpdateStatus(order.orderId, order.shopOrder.shop._id, newStatus);
              }}
              className={`rounded-md ${
                (statusMap[order.shopOrder._id] || order.shopOrder?.status) === "pending"
                  ? "bg-orange-100 text-orange-700"
                  : (statusMap[order.shopOrder._id] || order.shopOrder?.status) === "preparing"
                    ? "bg-yellow-100 text-yellow-700"
                    : (statusMap[order.shopOrder._id] || order.shopOrder?.status) === "outofdelivery"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              <NativeSelectOption value="">Select status</NativeSelectOption>
              <NativeSelectOption value="pending">Pending</NativeSelectOption>
              <NativeSelectOption value="preparing">Preparing</NativeSelectOption>
              <NativeSelectOption value="outofdelivery">Out of Delivery</NativeSelectOption>
            </NativeSelect>
          </div>

          {/* When status is outofdelivery */}
          {order?.shopOrder?.status === "outofdelivery" && (
            <>
              {availableBoys?.length > 0 ? (
                <div className="md:col-span-4 w-full mt-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                    <span className="text-green-600 text-2xl">🚴‍♂️</span>
                    Available Delivery Partners
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {availableBoys.map((boy) => (
                      <Card
                        key={boy._id}
                        className="group relative border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold group-hover:bg-green-200 transition">
                            {boy.fullName.charAt(0).toUpperCase()}
                          </div>

                          {/* Info */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{boy.fullName}</h4>
                            <p className="text-sm text-gray-500 mt-1">📞 {boy.mobile}</p>
                            <p className="text-xs text-gray-400 mt-1">Available for delivery</p>
                          </div>

                          {/* Button */}
                          
                        </CardContent>

                        {/* Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : order?.shopOrder?.assignedDeliveryBoy ? (
                <div className="md:col-span-4 w-full">
                  <Card className="w-full border border-green-200 bg-green-50 hover:shadow-md transition-shadow duration-300 rounded-2xl mt-4">
                    <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 space-y-4 md:space-y-0 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-lg">
                          {order.shopOrder.assignedDeliveryBoy.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {order.shopOrder.assignedDeliveryBoy.fullName}
                          </h4>
                          <p className="text-sm text-gray-600">📞 {order.shopOrder.assignedDeliveryBoy.mobile}</p>
                          <p className="text-xs text-green-600 font-medium mt-1">
                            ✅ Assigned Delivery Partner
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 transition-all"
                      >
                        Assigned
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="md:col-span-4 w-full mt-4 p-4 text-center border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                  Waiting for delivery boys...
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderList;
