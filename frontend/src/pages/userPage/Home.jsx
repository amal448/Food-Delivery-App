import { CarouselSlider } from '@/components/slider'
import ItemsCard from '@/components/usercomponents/ItemsCard'
import ListCard from '@/components/usercomponents/ListCard'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { useLoading } from '@/context/LoadingContext'
import { SpinnerCustom } from '@/components/spinner'

const Home = () => {
  const [updatedItemsList, setUpdatedItemsList] = useState([])

  const shops = useSelector(state => state?.user?.NearByShop)
  const items = useSelector(state => state?.user?.ItemByCity?.items)
  const searchItems = useSelector(state => state?.user?.SearchItems)

  const { loading } = useLoading();

  const handleCategoryByFilter = async (category) => {
    console.log("handleCategoryByFilter");

    if (items && category != "All") {
      const filtered = items.filter(item => item.category === category);
      setUpdatedItemsList(filtered);
    }
    else {
      setUpdatedItemsList(items);

    }
  }
  useEffect(() => {
    setUpdatedItemsList(items);
  }, [items])
  // console.log("searchItems", searchItems);

  const displayItems = searchItems && searchItems?.length > 0 ? searchItems : updatedItemsList;
  // console.log("displayItems", displayItems);

  return (
    <div className='mb-8 '>
      <div className='mb-8'>
        <h1 className="scroll-m-20 text-start text-3xl font-bold tracking-tight text-balance pb-4">
          Welcome Amal to the Platform of Foodies..
        </h1>
        <CarouselSlider onCategorySelect={handleCategoryByFilter} />
      </div>
      <div className='mb-8'>
        <h2 className="scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0 ">
          Near By Top Restaurants
        </h2>

        <div className="flex gap-7 flex-wrap">
          {shops && shops.length > 0 ? (
            shops.map((item) => <ListCard key={item._id} data={item} />)
          ) : (
            <p className="text-gray-500 text-sm">No shops available in your current Location.</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0 ">
          {searchItems && searchItems.length > 0 ? "Search Results" : "Suggested Food Items"}
        </h2>
        <div className='flex gap-3 flex-wrap'>
          {

            displayItems && displayItems.length > 0 ? (
              displayItems?.map((item) => {
                return (
                  <ItemsCard key={item._id} data={item} />
                )
              })) : (
              <p className="text-gray-500 text-sm">No items available</p>
            )
          }

        </div>
      </div>

    </div>
  )
}

export default Home