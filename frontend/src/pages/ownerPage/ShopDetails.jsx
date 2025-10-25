import React, { useState, useEffect } from 'react'
import { FaBowlFood } from "react-icons/fa6";
import { AddShop } from '@/components/ownercomponents/AddShop';
import { Sheet } from "@/components/ui/sheet"
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server } from '@/helpers/constants';
import { setMyShopData } from '@/app/ownerSlice';
import TanStackTable from '@/components/tanstacktable/page';
import { Button } from "@/components/ui/button"
import { MdDelete } from "react-icons/md";
import { OverAllChart } from '@/components/ownercomponents/Chart';
import { Card, CardContent } from '@/components/ui/card';
import { GrView } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import UseGetShopItems from '@/hooks/useGetShopItems';

const ShopDetails = () => {
    const [selectedData, setSelectedData] = useState([])
    const shopData = useSelector((state) => state?.owner?.myShopData)
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate=useNavigate()

    const handleView=async()=>{
        navigate(`/seller/view-Item/${id}`)
       
    }

    const fetchShop = async () => {
        try {
            const res = await axios.get(`${server}/api/shop/get-my`, { withCredentials: true });
            dispatch(setMyShopData(res.data));
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchShop();
    }, [id]);

    useEffect(() => {
        const DataFromRedux = shopData.filter(item => item._id === id)
        setSelectedData(DataFromRedux)
    }, [shopData, id])

    return (
        <div className='flex flex-col gap-8 mt-4'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    {selectedData[0]?.name || 'Shop Details'}
                </h1>
                <div className='flex gap-2'>
                      <Button onClick={()=>handleView(selectedData[0]._id)}  className="flex items-center text-white bg-blue-600 gap-1">
                        View Items <GrView />
                    </Button>
                    <Sheet>
                        <AddShop showData={selectedData} refreshShops={fetchShop} />
                    </Sheet>
                  
                    
                </div>
            </div>
            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {/* Orders Card */}
                <Card className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-2xl hover:shadow-lg transition">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedData[0]?.orders?.length || 0}</p>
                </Card>

                {/* Items Card */}
                <Card className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-2xl hover:shadow-lg transition">
                    <h3 className="text-gray-500 text-sm">Total Items</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedData[0]?.items?.length || 0}</p>
                </Card>

                {/* Example: Total Revenue Card */}
                <Card className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-2xl hover:shadow-lg transition">
                    <h3 className="text-gray-500 text-sm">Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">₹{selectedData[0]?.revenue || 0}</p>
                </Card>

                {/* Example: Active Customers Card */}
                <Card className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-2xl hover:shadow-lg transition">
                    <h3 className="text-gray-500 text-sm">Active Customers</h3>
                    <p className="text-2xl font-bold text-gray-900">{selectedData[0]?.customers?.length || 0}</p>
                </Card>
            </div>

            {/* Chart & Shop Info */}
            <div className='flex flex-col md:flex-row gap-6'>
                {/* Chart */}
                <div className='flex-1 bg-white rounded-2xl shadow p-4'>
                    <h2 className='text-xl font-semibold mb-2'>Overview</h2>
                    <OverAllChart />
                </div>

                {/* Shop Info Card */}
                <Card className="flex-1 rounded-2xl shadow">
                    <CardContent className="flex flex-col gap-4 p-6">
                        {/* Image */}
                        <img
                            src={selectedData[0]?.image}
                            alt={selectedData[0]?.name}
                            className="h-60 w-full object-cover rounded-xl"
                        />

                        {/* Shop Details */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">{selectedData[0]?.name}</h2>
                            <h3 className="text-lg text-gray-700">{selectedData[0]?.owner.fullName}</h3>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p><span className="font-medium">Address:</span> {selectedData[0]?.address}</p>
                                <p><span className="font-medium">City:</span> {selectedData[0]?.city}</p>
                                <p><span className="font-medium">State:</span> {selectedData[0]?.state}</p>
                                <p><span className="font-medium">Mobile:</span> {selectedData[0]?.owner.mobile}</p>
                                <p><span className="font-medium">Created At:</span> {new Date(selectedData[0]?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <Button variant="destructive" className="flex items-center gap-1">
                        Delete Shop <MdDelete />
                    </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Latest Orders Table */}
            <div className='flex flex-col gap-4'>
                <h2 className="text-2xl font-semibold border-b pb-2">Latest Orders</h2>
                {/* <TanStackTable /> */}
            </div>
        </div>
    )
}

export default ShopDetails
