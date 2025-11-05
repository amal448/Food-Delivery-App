import { Button } from "@/components/ui/button"
import { EditItem } from "../ownercomponents/EditItem"

export const columns = (refreshItems) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name
      const image = row.original.image

      return (
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-md object-cover border"
          />
          <span className="font-medium">{name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "shop",
    header: "Shop",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "foodType",
    header: "Veg/Non-Veg",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const food = row.original

      const handleDelete = () => {
        // console.log("Delete clicked:", food)
      }

      return (
        <div className="flex items-center gap-2">
          {/* Pass refreshItems so table reloads after edit */}
          <EditItem
            refreshShops={refreshItems}
            showData={food}
          />
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )
    },
  },
]
