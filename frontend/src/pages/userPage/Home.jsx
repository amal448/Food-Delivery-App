import { CarouselSlider } from '@/components/slider'
import ItemsCard from '@/components/usercomponents/ItemsCard'
import ListCard from '@/components/usercomponents/ListCard'
import { useSelector } from 'react-redux'
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { useLoading } from '@/context/LoadingContext'
import { SpinnerCustom } from '@/components/spinner'
const Home = () => {
  const shops = useSelector(state => state.user.NearByShop)
  const items = useSelector(state => state.user.ItemByCity)
  // console.log("items",items);
  const { loading } = useLoading();

  return (
    <div className='mb-8 '>
      <div className='mb-8'>
        <h1 className="scroll-m-20 text-start text-3xl font-bold tracking-tight text-balance pb-4">
          Welcome Amal to the Platform of Foodies..
        </h1>
        <CarouselSlider />
      </div>
      <div className='mb-8'>
        <h2 className="scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0 ">
          Near By Top Restaurants
        </h2>

        <div className="">
          { shops && shops.length > 0 ? (
            shops.map((item) => <ListCard key={item._id} data={item} />)
          ) : (
            <p className="text-gray-500 text-sm">No shops available in your current Location.</p>
          )}
        </div>
      </div>
      <div>
        <h2 className="scroll-m-20 pb-4 text-2xl font-bold tracking-tight first:mt-0 ">
          Suggested Food Items
        </h2>
        <div className='flex gap-3 flex-wrap'>
          {
            items && shops.length > 0 ? (
            items?.map((item) => {
              return (
                <ItemsCard key={item._id} data={item} />
              )
            })):(
              <p className="text-gray-500 text-sm">No items available</p>
            )
          }

        </div>
      </div>

    </div>
  )
}

export default Home