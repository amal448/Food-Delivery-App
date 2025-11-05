import { Button } from "@/components/ui/button"

export const columns = () => [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-medium text-gray-700 truncate max-w-[120px] block">
        {row.original.orderId}
      </span>
    ),
  },
  {
    accessorKey: "shopName",
    header: "Shop",
    cell: ({ row }) => (
      <span className="font-medium text-gray-700 truncate max-w-[120px] block">
        {row.original.shopName}
      </span>
    ),
  },
  {
    accessorKey: "itemName",
    header: "Item",
    cell: ({ row }) => (
      <span className="truncate max-w-[150px] block">
        {row.original.itemName}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price (₹)",
    cell: ({ row }) => (
      <span className="text-gray-800 font-semibold">
        ₹{row.original.price}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => <span>{row.original.quantity}</span>,
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <span className="capitalize text-gray-700">
        {row.original.paymentMethod}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span
        className="truncate max-w-[220px] block text-gray-600"
        title={row.original.address} // Tooltip on hover
      >
        {row.original.address}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-gray-600 whitespace-nowrap">
        {row.original.createdAt}
      </span>
    ),
  },
  {
    id: "actions",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (      
      <div className="flex justify-center">
        <Button variant="outline" size="sm" className="text-xs">
          {row.original.status}
        </Button>
      </div>
    ),
  },
]
