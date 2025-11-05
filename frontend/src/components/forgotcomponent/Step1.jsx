import React from 'react'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { IoIosArrowRoundBack } from "react-icons/io";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios';

// ✅ Step 1: Define Zod schema
const formSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address"),
})

const Step1 = ({ setEmail, setStep, email }) => {
  const navigate = useNavigate()

  // ✅ Step 2: Add resolver with schema
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || ""
    },
  })

  const onSubmit = async (data) => {
    try {
      // console.log("Forgot Password Email:", data)
      setEmail(data.email)
      const res = await axios.post('http://localhost:8000/api/auth/send-otp', { email: data.email }, { withCredentials: true })
      setStep(2)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        {/* Back Arrow */}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll send a password reset link to your email.
                    </FormDescription>
                    {/* ✅ Error message automatically from Zod */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer bg-indigo-500 hover:bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                Send Reset Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step1
