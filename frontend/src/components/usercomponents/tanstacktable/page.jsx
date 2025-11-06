import { useSelector } from "react-redux";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"; // or adjust import based on your project
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ViewItems() {
  const item = useSelector((state) => state?.user?.myOrders);
  const navigate = useNavigate()

  if (!item) {
    return <p className="text-center">Loading items...</p>;
  }

  // Flatten orders for display
  const formattedData = item.flatMap(order =>
    order.shopOrder.flatMap(shopOrder =>
      shopOrder.shopOrderItems.map(item => ({
        orderId: order._id,
        shopName: shopOrder.shop?.name || "N/A",
        itemName: item.item?.name || "N/A",
        price: item.item?.price || 0,
        quantity: item.quantity,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        address: order.deliveryAddress?.text || "N/A",
        status: shopOrder.status,
        createdAt: new Date(order.createdAt).toLocaleString(),
      }))
    )
  );
  console.log("formattedData", formattedData);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>

      {formattedData.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        formattedData.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 rounded-md border border-gray-300 text-gray-800"
          >
            {/* Item Info */}
            <div className="flex gap-5">
              <img
                className="w-12 h-12 object-cover opacity-60"
                src="https://up.yimg.com/ib/th/id/OIP.IlVhQA_kLRc4v8ABHgYa0gHaE8?pid=Api&rs=1&c=1&qlt=95&w=179&h=119"
                alt="boxIcon"
              />
              <div className="flex flex-col justify-center">
                <p className="font-medium">
                  {order.itemName}{" "}
                  <span className="text-indigo-500">
                    {order.quantity} × ₹{order.price}
                  </span>
                </p>
                <p className="text-sm text-gray-500">{order.shopName}</p>
              </div>
            </div>

            {/* Address & Payment */}
            <div className="font-medium text-sm space-y-1">
              <p className="text-gray-700">{order.address}</p>
              <p className="uppercase text-xs text-gray-500">
                {order.paymentMethod}
              </p>
            </div>

            {/* Total */}
            <p className="font-medium text-base my-auto text-black/70">
              ₹{order.price * order.quantity}
            </p>

            {/* Meta Info */}
            <div className="flex flex-col gap-3 text-sm">
              <p>
                {/* Method{" "} */}
                <span className="uppercase font-bold">
                  {order.paymentMethod == 'cod' ?
                    <p>Method:{' '}{order.paymentMethod?.toUpperCase()}</p> :
                    <p>Online Payment:{' '}{order.payment ? "true" : "false"}</p>
                  }
                </span>
              </p>
              <p>Date: {order.createdAt}</p>
              <p
                className={`font-bold ${{
                  pending: "text-yellow-500",
                  outofDelivery: "text-blue-500",
                  process: "text-orange-500",
                  delivered: "text-green-500",
                  cancelled: "text-red-500",
                }[order.status] || "text-gray-500"
                  }`}
              >
                Status: {order.status}
              </p>
              <Button onClick={() => navigate(`/track-order/${order.orderId}`)}>Track Order</Button>


            </div>
          </div>
        ))
      )}
    </div>
  );
}
