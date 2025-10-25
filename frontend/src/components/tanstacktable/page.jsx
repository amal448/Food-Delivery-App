import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Sheet } from "../ui/sheet"
import { AddItem } from "../ownercomponents/AddItem"
import UseGetShopItems from "@/hooks/useGetShopItems"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"

export default function ViewItems() {
  const [data, setData] = useState([])
  const { id } = useParams()
  const { fetchItems } = UseGetShopItems(id)
  // console.log("fetchItems",fetchItems);
  
  const item = useSelector((state) => state?.owner?.myShopItems)
  console.log("items", item);
  if (!item) {
    return <p className="text-center">Loading items...</p>;
  }
  return (
    <div className="container mx-auto py-10">
      <Sheet>
        <div className="flex justify-end mb-5 mx-3">
          <AddItem refreshShops={fetchItems}  />
        </div>
      </Sheet>
      <DataTable columns={columns(fetchItems)} data={Array.isArray(item) ? item : []} />

    </div>
  )
}
