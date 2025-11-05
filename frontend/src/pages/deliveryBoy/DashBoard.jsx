import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import axios from 'axios'
import { setAddress, setLocation, setDeliveryBoyLocation } from '@/app/mapSlice'
import useUpdateLocation from '@/hooks/useUpdateLocation'

const DeliveryDashBoard = () => {
  const dispatch = useDispatch()
  const updateLocation = useUpdateLocation(); // ✅ hook call
  const { location, address, deliveryboylocation } = useSelector(state => state.map)
  const [addressInput, setAddressInput] = useState('')
  const { lat, lon, city, postcode, street, suburb } = location || {}

  function RecenterMap({ location }) {
    const map = useMap()
    useEffect(() => {
      if (location?.lat && location?.lon) {
        map.setView([location.lat, location.lon], 16, { animate: true })
      }
    }, [location?.lat, location?.lon, map])
    return null
  }




  // 🗺️ Get current location → set both
  const getCurrentLocation = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        const data = await getAddressByLatLng(latitude, longitude)

        if (data) {
          dispatch(setLocation(data))                // set map center
          dispatch(setDeliveryBoyLocation(data))     // set initial delivery boy location
          dispatch(setAddress(data.address_line2))
          setAddressInput(data.address_line2)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  // 🧠 Run once on mount
  if (!deliveryboylocation?.lat) {
    getCurrentLocation()
  }

  // 🧩 Get address details by lat/lon
  const getAddressByLatLng = async (lat, lon) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`
      )

      const data = result?.data?.results?.[0]
      if (!data) return null

      return {
        lat: data?.lat,
        lon: data?.lon,
        city: data?.city,
        postcode: data?.postcode,
        street: data?.street,
        suburb: data?.suburb,
        address_line2: data?.address_line2
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 🖱️ On marker drag → update only deliveryBoyLocation
  const ondragEnd = async (e) => {
    const { lat, lng } = e.target._latlng
    const data = await getAddressByLatLng(lat, lng)
    if (data) {
      dispatch(setDeliveryBoyLocation(data)) // ✅ only update delivery boy location
      updateLocation(lat, lng);
    }
  }
  console.log(deliveryboylocation);

  return (
    <>
      <h3 className="my-5 text-2xl font-semibold tracking-tight">
        Your Current Location Status:
        <span className="text-green-600">
          {' '}{deliveryboylocation.city} | {deliveryboylocation.street} | {deliveryboylocation.suburb}
        </span>
      </h3>
      <div className='flex  gap-3 my-5'>
        <h5>Latitude: {deliveryboylocation.lat}</h5>
        <h5>Longitude: {deliveryboylocation.lon}</h5>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 h-[550px]">
        {/* Left Map Section */}
        <div className="h-full">
          <div className="relative h-full bg-muted border-gray-400 border-2 z-0 overflow-hidden rounded-lg">
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
                <RecenterMap location={deliveryboylocation} />

                {/* 🟢 Draggable delivery boy marker */}
                <Marker
                  position={[deliveryboylocation.lat || location.lat, deliveryboylocation.lon || location.lon]}
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

        {/* Right Side Content */}
        <div className="h-full">
          <Card className="w-full h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
              <CardDescription>Your current delivery location</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input disabled id="street" value={deliveryboylocation.street || ""} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input disabled id="city" value={deliveryboylocation.city || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input disabled id="zip" value={deliveryboylocation.postcode || ""} />
                </div>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default DeliveryDashBoard
