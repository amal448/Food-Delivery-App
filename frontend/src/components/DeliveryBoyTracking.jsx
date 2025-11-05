import React from 'react'
import scooter from '../assets/scooter.png'
import homeicon from '../assets/homeicon.png'
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

const deliveryBoyIcon = new L.icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})

const customerIcon = new L.icon({
    iconUrl: homeicon,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})

const DeliveryBoyTracking = ({ data }) => {
    console.log("DeliveryBoyTracking", data);

    const deliveryBoyLat = data?.deliveryBoyLocation?.lat
    const deliveryBoyLon = data?.deliveryBoyLocation?.lon
    const customerLat = data?.customerLocation?.lat
    const customerLon = data?.customerLocation?.lon

    // Check if coordinates exist
    const hasValidCoords =
        deliveryBoyLat &&
        deliveryBoyLon &&
        customerLat &&
        customerLon

    if (!hasValidCoords) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-xl shadow-md mt-3">
                <p className="text-gray-600">Waiting for location data...</p>
            </div>
        )
    }

    const path = [
        [deliveryBoyLat, deliveryBoyLon],
        [customerLat, customerLon]
    ]

    const center = [deliveryBoyLat, deliveryBoyLon]

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            <div className='my-4'>
                <p>Delivery Boy position={[deliveryBoyLat, deliveryBoyLon]}</p>
                <p>Customer position={[customerLat, customerLon]}</p>
            </div>

            <MapContainer
                className="w-full h-full"
                center={center}
                zoom={16}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon} >
                    <Popup>Delivery Boy</Popup>
                </Marker>
                <Marker position={[customerLat, customerLon]} icon={customerIcon}>
                    <Popup>Delivery Location</Popup>
                </Marker>

                {/* Optional path line between delivery boy and customer */}
                <Polyline positions={path} color="blue" />
            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking
