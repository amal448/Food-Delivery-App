import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MapPin } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDispatch, useSelector } from 'react-redux'
import { setAddress, setLocation } from '@/app/mapSlice'
import axios from 'axios'
import { setCity } from '@/app/userSlice'

const LocationChange = () => {
    console.log("cncdnjsd");

    const { location, address } = useSelector(state => state.map)
    const [addressInput, setAddressInput] = useState('')
    const dispatch = useDispatch()

    const getLatLngByAddress1 = async () => {
        try {

            const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)

            console.log("result lat,lon", result.data);
            dispatch(setCity(result.data.results[0].city))
            getAddress(result.data.results[0].lat, result.data.results[0].lon)
        }
        catch (error) {
            console.log(error);

        }
    }
    const getAddress = async (lat, lon) => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${import.meta.env.VITE_GEOAPI_KEY}`)
            dispatch(setAddress(result?.data?.results[0]?.address_line2))
            dispatch(setLocation({ lat: result?.data?.results[0]?.lat, lon: result?.data?.results[0]?.lon }))

        }
        catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        getLatLngByAddress1()
    }, [addressInput])
    return (
        <AlertDialogContent>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Enter your nearby city/Town
                    </CardTitle>
                    <CardDescription>We’ll show shops near you within a 5 km radius.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex w-full gap-4 items-center">
                        <Input
                            id="address"
                            className="flex-1" // takes all remaining space
                            value={addressInput}
                            onChange={e => setAddressInput(e.target.value)}
                            placeholder="Address"
                        />
                        <AlertDialogAction onClick={() => getLatLngByAddress1()}>
                            Search
                        </AlertDialogAction>
                    </div>
                </CardContent>


            </Card>
        </AlertDialogContent>
    )
}

export default LocationChange