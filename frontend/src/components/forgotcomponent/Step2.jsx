import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
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
import axios from "axios"

const FormSchema = z.object({
    pin: z.string().min(4, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function Step2({ email, setStep }) {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data) {
        try {
            console.log("Forgot Password Email:", data)

            const res = await axios.post('http://localhost:8000/api/auth/verify-otp', { email, otp: data.pin }, { withCredentials: true })
            if (setStep == 2) {
                setStep(3)
            }
            else {
                if (res.data.success) {
                    toast.success("OTP verified successfully!");
                    onVerified(); // go back to SignUp component → navigate("/")
                } else {
                    toast.error("Invalid OTP. Please try again.");
                }
            }
        }
        catch (error) {
            console.log(error.message);

        }
    }

    return (
        <Card>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col items-center justify-center">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>

                                    <FormLabel className='flex justify-center mb-3 uppercase'>Enter Your Otp</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center">

                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />

                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                    </FormControl>
                                    <FormDescription>
                                        Please enter the one-time password sent to your phone.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className='cursor-pointer'>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
