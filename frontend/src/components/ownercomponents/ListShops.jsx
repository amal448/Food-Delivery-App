import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../ui/card'

const ListShops = ({ shop }) => {
    const navigate = useNavigate()

    const handleView = (shopid) => {

        navigate(`/seller/shop-details/${shopid}`);
    };
    return (
        <>
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 pt-6">
                {
                    shop?.map((item) => {
                        return (

                            <Card key={item._id} className="w-full sm:w-[300px] md:w-[400px] py-0 rounded-2xl shadow">
                                <CardContent className="flex flex-col gap-4  p-4">
                                    <img
                                        src={item.image}
                                        className="h-[200px] w-full object-cover rounded-xl"
                                    />
                                    <div className="flex flex-col gap-2  ">
                                        <h2 className="text-2xl font-semibold">{item.name}</h2>

                                        <div className="text-sm text-gray-500 space-y-1 flex justify-between">
                                            <div className='flex flex-col gap-2'>
                                                <p><span className="font-medium">Address:</span> address</p>
                                                <p><span className="font-medium">Location:</span> city</p>
                                                <p><span className="font-medium">State:</span> state</p>
                                                <Button onClick={() => handleView(item._id)}>
                                                    View
                                                </Button>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        )
                    })
                }


            </div>
        </>
    )
}

export default ListShops