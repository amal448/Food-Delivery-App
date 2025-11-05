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
import { getDistanceInKm } from '@/helpers/getDistanceInKm';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNavigate } from 'react-router-dom'
import { addMyOrder, clearCart, setCartItems } from '@/app/userSlice'

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
  const { lat, lon, city, postcode, street, suburb } = location || {}

  const [addressInput, setAddressInput] = useState('')
  const [paymentMode, setPaymentMode] = useState("cod")

  const dispatch = useDispatch()
  const near = useSelector(state => state?.user?.NearByShop[0])
  const phone = useSelector(state => state?.user?.userData?.mobile)
  const cartItems = useSelector(state => state.user.CartItems)
  const userData = useSelector(state => state.user)
  const navigate = useNavigate()

  const ondragEnd = (e) => {
    console.log(e.target);
    console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng

    dispatch(setLocation({
      lat: lat,
      lon: lng,
    }))
    getAddressByLatLng(lat, lng)
  }
  //map drap lat and lon
  const getAddressByLatLng = async (lat, lon) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
      );

      const data = result?.data?.results?.[0];
      if (!data) return;

      dispatch(setAddress(data?.address_line2));
      dispatch(
        setLocation({
          lat: data?.lat,
          lon: data?.lon,
          city: data?.city,
          postcode: data?.postcode,
          street: data?.street,
          suburb: data?.suburb,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        // console.log("vheckout Latitude:", latitude, " checkout Longitude:", longitude);
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

      const data = result.data.results[0];
      console.log(data);

      if (!data) return alert("Address not found!");

      const latitude = result.data.results[0].lat
      const longitude = result.data.results[0].lon

      const shop = near;
      if (!shop) return alert("Shop info not available!");

      const [shopLon, shopLat] = shop.location.coordinates;
      const deliveryRadius = shop.deliveryRadius || 5;

      const distance = getDistanceInKm(shopLat, shopLon, latitude, longitude);
      console.log("Distance:", distance, "km");

      if (distance > deliveryRadius) {
        alert(`Sorry, this address is ${distance.toFixed(2)} km away — outside the shop’s ${deliveryRadius} km delivery range.`);
        return;
      }

      dispatch(setLocation({
        lat: latitude,
        lon: longitude,
        city: result?.data?.results[0]?.city,
        postcode: result?.data?.results[0]?.postcode,
        street: result?.data?.results[0]?.street,
        suburb: result?.data?.results[0]?.suburb,
      }))
      getAddressByLatLng(latitude, longitude)
    }
    catch (error) {
      console.log(error);

    }
  }
  const handlePlaceOrder = async () => {
    console.log("startcdc");
    try {

      const result = await axios.post(`${server}/api/order/place-order`,
        {
          paymentMode,
          deliveryAddress: {
            text: addressInput,
            latitude: location.lat,
            longitude: location.lon
          },
          TotalPrice: userData.TotalPrice,
          cartItems
        }, { withCredentials: true }
      )

      if (paymentMode == 'cod') {
        console.log(result.data);
        // if(result.data)
        dispatch(addMyOrder(result.data))
        dispatch(clearCart())
        navigate('/order-success')
      }
      else {
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorpayWindow(orderId, razorOrder)
      }

    }
    catch (error) {
      console.log(error);

    }
  }

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Food Delivery App",
      description: "React App Payment Test",
      order_id: razorOrder.id,

      handler: async function (response) {
        try {
          const result = await axios.post(`${server}/api/order/verify-payment`, {
            razorpay_payment_id: response.razorpay_payment_id,
            orderId
          }, { withCredentials: true })
          dispatch(addMyOrder(result.data))
          dispatch(clearCart())
          navigate('/order-success')

        }
        catch (error) {
          console.log(error);
          
        }
      },
      // prefill: {
      //   name: "Amal Thomas",
      //   email: "amalthomas@example.com",
      //   contact: "9999999999",
      // },
      // theme: {
      //   color: "#3399cc",
      // },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }


  useEffect(() => {
    setAddressInput(address)

  }, [address])

  return (
    <div className='h-full  '>
      <div className='grid lg:grid-cols-2 gap-8'>
        <div>
          <div className=" space-y-6 relative h-[750px] bg-muted border-gray-400 border-2 z-0 overflow-hidden">
            {location?.lat && location?.lon ? (
              <MapContainer
                className="w-full h-full"
                center={[location.lat, location.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location.lat, location.lon]}
                  draggable
                  eventHandlers={{ dragend: ondragEnd }}
                />
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Fetching location...</p>
              </div>
            )}

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
                  <Label htmlFor="street">Street Address</Label>
                  <Input disabled={true}
                    id="street"
                    value={street || ''}
                    onChange={(e) => setstreetInput(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input disabled={true}
                      id="city"
                      value={city || ''}
                      onChange={(e) => setcityInput(e.target.value)}
                      placeholder="New York"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input disabled={true}
                      id="zip"
                      value={postcode || ''}
                      onChange={(e) => setpostInput(e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input disabled={true} value={phone} id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="payment">Payment Mode</Label>
                  <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Cash on Delivery */}
                      <Label
                        htmlFor="cod"
                        className={`cursor-pointer flex-1 rounded-md border-2 flex items-center justify-center gap-3 py-3 transition-all ${paymentMode === "cod"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-400"
                          }`}
                      >
                        <RadioGroupItem value="cod" id="cod" className="hidden" />
                        <FaIndianRupeeSign className="text-green-600 text-lg" />
                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                      </Label>

                      {/* UPI / Card */}
                      <Label
                        htmlFor="online"
                        className={`cursor-pointer flex-1 rounded-md border-2 flex items-center justify-center gap-3 py-3 transition-all ${paymentMode === "online"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-400"
                          }`}
                      >
                        <RadioGroupItem value="online" id="online" className="hidden" />
                        <FaIndianRupeeSign className="text-blue-600 text-lg" />
                        <span className="font-medium text-gray-800">
                          UPI / Credit / Debit Card
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Optional: show selected */}
                  <p className="text-sm text-gray-600">Selected: {paymentMode}</p>
                </div>

                <div className="">
                  <div className='mb-4'>
                    <CardTitle>Order Summary</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹ {''}{userData.TotalPrice}</span>
                      </div>
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">$10.00</span>
                      </div> */}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">₹ {''}{userData.TotalPrice}</span>
                      </div>
                    </div>

                    <Button onClick={handlePlaceOrder} className="w-full" size="lg">
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