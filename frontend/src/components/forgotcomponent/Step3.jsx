import React from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios'

const ResetSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const Step3 = ({email}) => {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "", // ✅ match case exactly
    }
  })

  const onSubmit = async(data) => {
    // console.log("Reset form submitted:", data)
    try{
      const res = await axios.post('http://localhost:8000/api/auth/reset-password', {email,newpassword:data.password}, { withCredentials: true })
        navigate('/signin')
    }
    catch(error)
    {

    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full min-w-md p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <IoIosArrowRoundBack
            className="cursor-pointer hover:text-gray-700 transition"
            onClick={() => navigate('/signin')}
            size={28}
          />
          <CardTitle className="text-xl font-semibold">Forgot Password</CardTitle>
        </div>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword" // ✅ match case exactly
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full cursor-pointer">
                Reset Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step3
