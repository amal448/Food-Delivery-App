import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from 'lucide-react'
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const OrderPlaced = () => {
    const navigate=useNavigate()
    return (
        <div className='flex flex-col justify-center items-center h-[calc(100vh-170px)]'>
            <div className='py-[200px] px-[200px] bg-gray-500/20  rounded-2xl'>
                <div className='flex gap-2 items-center justify-center'>
                    <h3 className="uppercase underline  text-3xl text-green-400 font-semibold tracking-tight">
                        Order Placed
                    </h3>
                    <FaCheckCircle size={25} className='text-green-400'/>
                </div>
                <div className='mt-3 flex gap-3 justify-center'>
                    <Button onClick={()=>navigate('/my-orders')} variant="outline">View Order</Button>
                    {/* <Button variant="outline" size="icon" aria-label="Submit">
                        <ArrowUpIcon />
                    </Button> */}
                </div>
            </div>
        </div>
    )
}

export default OrderPlaced