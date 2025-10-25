import React, { useState, useEffect } from 'react'
import { MapContainer, Marker, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import "leaflet/dist/leaflet.css"
import { TileLayer } from 'react-leaflet/TileLayer'
import { CreditCard, MapPin, Lock } from 'lucide-react'
import { FaLocationCrosshairs } from "react-icons/fa6";
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { setAddress, setLocation } from '@/app/mapSlice'
import axios from 'axios'
import { server } from '@/helpers/constants'
import { FaIndianRupeeSign } from "react-icons/fa6";
//for centering locating center towards the pointed place
function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null
}

const CheckOut = () => {
  const { location, address } = useSelector(state => state.map)
  const [addressInput, setAddressInput] = useState('')
  console.log("location checkout", location);

  const dispatch = useDispatch()

  const ondragEnd = (e) => {
    console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat: lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }

  const getAddressByLatLng = async (lat, lon) => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)
      dispatch(setAddress(result?.data?.results[0]?.address_line2))

    }
    catch (error) {
      console.log(error);

    }
  }
  const getCurrentLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log("vheckout Latitude:", latitude, " checkout Longitude:", longitude);
        dispatch(setLocation({ lat: latitude, lon: longitude }))
        getAddressByLatLng(latitude, longitude)


      })
    }
    catch (error) {
      console.log(error);

    }
  }
  const getLatLngByAddress = async () => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)
      console.log("result lat,lon", result.data.results[0].lat, result.data.results[0].lon);
      const latitude = result.data.results[0].lat
      const longitude = result.data.results[0].lon
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
    }
    catch (error) {
      console.log(error);

    }
  }
  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${server}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon
          },
          totalAmount,
          cartItems
        }, { withCredentials: true }
      )
      console.log(result.data);

    }
    catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='h-full  '>
      <div className='grid lg:grid-cols-2 gap-8'>
        <div>
          <div className=" space-y-6 relative h-[750px] bg-muted border-gray-400 border-2 z-0 overflow-hidden">
            <MapContainer
              className={"w-full h-full"}
              center={[location?.lat, location?.lon]}
              zoom={16}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap location={location} />
              <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: ondragEnd }} />
            </MapContainer>
          </div>

        </div>

        {/* Checkout Content */}
        <div className="container max-w-full mx-auto px-4 ">

          <div className=" space-y-6 ">
            {/* Delivery Address */}
            <Card className='w-full'>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-[3]">
                    <Input
                      className="w-full"
                      id="address"
                      value={addressInput}
                      onChange={e => setAddressInput(e.target.value)}
                      placeholder="Address"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-[1]">
                    <Button onClick={() => getLatLngByAddress()}>Search</Button>
                    <Button onClick={() => getCurrentLocation()}>
                      <FaLocationCrosshairs />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>

                <div className="space-y-4">
                  {/* <CardContent className=""> */}
                  <Label htmlFor="phone">Payment Mode</Label>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Cash on Delivery */}
                    <Card className="py-3 flex flex-row items-center justify-center gap-3 flex-1 rounded-sm  border-2 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                      <FaIndianRupeeSign className="text-green-600 text-lg" />
                      <span className="font-medium text-gray-800">Cash on Delivery</span>
                    </Card>

                    {/* UPI / Card */}
                    <Card className="py-3 flex flex-row items-center justify-center gap-3 flex-1 rounded-sm  border-2 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                      <FaIndianRupeeSign className="text-blue-600 text-lg" />
                      <span className="font-medium text-gray-800">UPI / Credit / Debit Card</span>
                    </Card>
                  </div>
                  {/* </CardContent> */}
                </div>

                <div className="">
                  <div className='mb-4'>
                    <CardTitle>Order Summary</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">$99.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">$10.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">$8.91</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">$117.91</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Place Order
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By placing your order, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
          <div className="grid grid-cols-2">



          </div>
        </div>
      </div>


    </div>
  )
}

export default CheckOut