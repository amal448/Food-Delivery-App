import React from 'react'
import Navbar from '@/components/usercomponents/Navbar'
import { Outlet } from 'react-router-dom'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import useGetItemsByCity from '@/hooks/useGetItemsByCity';
import { useSelector } from 'react-redux'
import LocationChange from '@/components/usercomponents/LocationChange'
import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FaLocationDot } from 'react-icons/fa6'
import Skeletonloader from '@/components/skeletonloader'

const Layout = () => {
  const { isEmpty } = useGetItemsByCity()
  const city = useSelector((state) => state.user.city)

  return (
    <div className='min-h-screen w-full px-6  overflow-hidden '>
      <Navbar />
      <div className='pt-32 container mx-auto py-4  px-6 md:px-20 lg:px-32  w-full overflow-hidden'>
        {isEmpty && (
          <Alert variant="destructive">
            <Terminal />
            <AlertTitle>OOPS!
              Service not Available in the current location.

            </AlertTitle>
            <AlertDescription className='flex text-lg'>
              Your current location is detected as

              <AlertDialog>
                <AlertDialogTrigger  >
                  <div className='flex justify-center items-center gap-3'>
                    <FaLocationDot size={20} color={"orange"} />
                    <span className=' font-bold underline'>{city}</span> . Please update it if this is not correct..
                  </div>
                </AlertDialogTrigger>
                <LocationChange />
              </AlertDialog>
            </AlertDescription>
          </Alert>
        )}
        {
          isEmpty ?(
              <Skeletonloader/>
          ):(
            
            <Outlet />
          )
        }

      </div>
    </div>
  )
}

export default Layout