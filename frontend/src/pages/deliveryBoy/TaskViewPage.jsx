import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { server } from '@/helpers/constants'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
} from "@/components/ui/card"

import DeliveryBoyTracking from '@/components/DeliveryBoyTracking'
import { Separator } from '@/components/ui/separator'

const FormSchema = z.object({
    pin: z.string().min(4, {
        message: "Your one-time password must be 6 characters.",
    }),
})

const TaskViewPage = () => {
    const { userData } = useSelector(state => state.user)
    const [AvailableBoys, setAvailableBoys] = useState([])
    const [currentOrder, setCurrentOrder] = useState()
    const [showOtpBox, setShowOtpBox] = useState(false)
    const [otp, setOtp] = useState("")
    const [open, setOpen] = useState(false)

    const getAssignments = async () => {
        try {
            const result = await axios.get(`${server}/api/order/get-assignments`, { withCredentials: true })
            console.log(result.data);
            setAvailableBoys(result.data)
        }
        catch (error) {
            console.log(error);

        }
    }
    const getCurrentOrder = async () => {
        try {
            const result = await axios.get(`${server}/api/order/get-current-order`, { withCredentials: true })
            console.log(result.data);
            setCurrentOrder(result.data)
        }
        catch (error) {
            console.log(error);

        }
    }

    const acceptOrder = async (assignmentId) => {
        try {
            const result = await axios.get(`${server}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
            console.log(result.data);
            getCurrentOrder()
        }
        catch (error) {
            console.log(error);

        }
    }
    
    const sendOtp = async () => {
        setShowOtpBox(true)
        try {
            const result = await axios.post(`${server}/api/order/send-delivery-otp`, {orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id}, { withCredentials: true })
            console.log(result.data);
           
        }
        catch (error) {
            console.log(error);

        }
    }
    const verifyOtp = async () => {
        try {
            console.log(otp);
            
            const result = await axios.post(`${server}/api/order/verify-delivery-otp`, {orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id,otp}, { withCredentials: true })
            console.log(result.data);
           
        }
        catch (error) {
            console.log(error);

        }
    }


    useEffect(() => {
        getAssignments()
        getCurrentOrder()
    }, [userData])

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })
    async function onSubmit(data) {
        try {
            console.log("onSubmit:", data.pin)
            setOtp(data?.pin)
            verifyOtp()
            // const res = await axios.post('http://localhost:8000/api/auth/verify-otp', { email, otp: data.pin }, { withCredentials: true })
            // if (setStep == 2) {
            //     setStep(3)
            // }
            // else {
            //     if (res.data.success) {
            //         toast.success("OTP verified successfully!");
            //         onVerified(); // go back to SignUp component → navigate("/")
            //     } else {
            //         toast.error("Invalid OTP. Please try again.");
            //     }
            // }
        }
        catch (error) {
            console.log(error.message);

        }
    }

    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-lg font-medium">Order List</h2>
            {
                AvailableBoys.map((item) => {
                    console.log("availableboys", item);

                    return (

                        <Card

                            className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-xl"
                        >
                            <CardContent className="flex items-center justify-between py-4 px-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {item?.shopName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {item?.deliveryAddress?.text}
                                    </p>
                                </div>
                                {
                                    !currentOrder &&
                                    <Button
                                        onClick={() => {
                                            acceptOrder(item?.assignmentId)
                                            setOpen(true)
                                        }
                                        }
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-green-100 bg-green-200 hover:text-green-700 transition-all"
                                    >
                                        Accept
                                    </Button>
                                }
                            </CardContent>

                        </Card>
                    )

                })
            }

            {
                currentOrder && (
                    <>
                        <Separator />

                        <Card
                            className="w-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-xl"
                        >
                            <CardContent className=" space-y-5 py-4 px-6">

                                <div className='mb-2'>
                                    {/* <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                                                   Task Details
                                                </h3> */}
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        CustomerName:  {currentOrder?.user?.fullName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Mobile No:   {currentOrder?.user?.mobile}
                                    </p>
                                </div>

                                <DeliveryBoyTracking data={currentOrder} />
                                {
                                    !showOtpBox ? (
                                        <Button
                                            onClick={() => {
                                                
                                                sendOtp()
                                               
                                            }
                                            }
                                            variant="outline"
                                            size="sm"
                                            className=" w-full hover:bg-green-100 bg-green-200 hover:text-green-700 transition-all"

                                        >
                                            Mark As Delivered
                                        </Button>

                                    ) : (
                                        <Card>
                                            <CardContent>
                                                <Form {...form}>
                                                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col items-center justify-center">
                                                        <FormField
                                                            control={form.control}
                                                            name="pin"
                                                            render={({ field }) => (
                                                                <FormItem>

                                                                    <FormLabel className='flex justify-center mb-3 uppercase'>enter Otp</FormLabel>
                                                                    <FormDescription>
                                                                        <FormLabel className='text-lg'>
                                                                            Please enter otp sent to {currentOrder.user.fullName}{' '}-{currentOrder.user.mobile}
                                                                        </FormLabel>

                                                                    </FormDescription>
                                                                    <FormControl>
                                                                        <div className="flex justify-center">
                                                                            <InputOTP  value={otp} maxLength={6} {...field}>
                                                                                <InputOTPGroup>
                                                                                    <InputOTPSlot index={0} />
                                                                                    <InputOTPSlot index={1} />
                                                                                    <InputOTPSlot index={2} />
                                                                                    <InputOTPSlot index={3} />

                                                                                </InputOTPGroup>
                                                                            </InputOTP>
                                                                        </div>

                                                                    </FormControl>

                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <Button onClick={()=>verifyOtp()} type="submit" className='cursor-pointer'>Submit</Button>
                                                    </form>
                                                </Form>
                                            </CardContent>
                                        </Card>
                                    )
                                }
                            </CardContent>
                        </Card>

                    </>
                )
            }



        </div>
    )
}

export default TaskViewPage