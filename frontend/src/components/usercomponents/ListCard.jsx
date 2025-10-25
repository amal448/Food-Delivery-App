import React from 'react'
import { Card, CardContent } from '../ui/card'


const ListCard = ({data}) => {
    return (
        <div className=''>
            {/* Shop Info Card */}
            <Card className="w-full sm:w-[300px] md:w-[400px] py-0 rounded-2xl shadow">
                <CardContent className="flex flex-col gap-4  p-4">
                    <img
                        src={data?.image}
                        className="h-[200px] w-full object-cover rounded-xl"
                    />
                    <div className="flex flex-col gap-2  ">
                        <h2 className="text-2xl font-semibold">{data.name}</h2>
                       
                        <div className="text-sm text-gray-500 space-y-1 flex justify-between">
                            <div  className='flex flex-col gap-2'>
                                <p><span className="font-medium">Address:</span> {data?.address}</p>
                                <p><span className="font-medium">Location:</span> {data?.city}</p>
                                <p><span className="font-medium">State:</span> {data?.state}</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                {/* <p><span className="font-medium">Contact:</span> {data?.mobile}</p> */}
                                {/* <p><span className="font-medium">Created At:</span> date</p> */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

export default ListCard