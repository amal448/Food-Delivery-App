import { useState } from "react";
import { FaUserCircle, FaMobile } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEyeSlash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "@/app/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";


// ✅ Zod validation schema
const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name too long"),
  email: z.string().email("Enter a valid email"),
  mobile: z
    .string()
    .regex(/^0\d{10}$/, "Enter a valid 11-digit mobile number starting with 0"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
const OtpSchema = z.object({
  pin: z.string().min(4, { message: "Your one-time password must be at least 4 digits." }),
});
const roles = [
  { label: "Delivery Boy", value: "deliveryBoy" },
  { label: "Owner", value: "owner" },
];

const SignUp = () => {
  const [role, setRole] = useState(null)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const otpForm = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: { pin: "" },
  });
  // ✅ useForm setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // ✅ Handle SignUp Submit
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/signup",
        { ...data, role },
        { withCredentials: true }
      );
      dispatch(setUserData(res?.data))

      if (res.data) {
        setEmail(res?.data?.email)
        const otpres = await axios.post('http://localhost:8000/api/auth/send-otp', { email: res.data.email }, { withCredentials: true })
      
        if (otpres.data.success) {
          setShowOtpModal(true); // ✅ Open popup
        }
      }
      console.log("Signup Success:", res.data);
      reset(); // clear form after success
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
    }
  };
  const onSubmitOtp = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-otp",
        { email, otp: data.pin },
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ Close popup and redirect
        console.log(res.data);

        setShowOtpModal(false);
        setTimeout(() => {
          navigate("/seller");
        }, 200);
      } else {
        otpForm.setError("pin", { message: "Invalid OTP, please try again." });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
    }
  };

  // ✅ Google Auth
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const res = await axios.post(
        "http://localhost:8000/api/auth/google-sign",
        {
          fullName: result.user.displayName,
          email: result.user.email,
        },
        { withCredentials: true }
      );
      console.log("Google Signup:", res.data);
    } catch (error) {
      console.log("Google Auth Error:", error);
    }
  };


  return (
    <div className="flex h-screen max-w-7xl mx-auto py-5">
      {/* Left Image */}
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      {/* Form Section */}
      <div className="w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-96 w-80 flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl text-gray-900 font-medium uppercase">
            Sign Up
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Create an account to get started
          </p>
          <div className="py-5">
            <div className="flex gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`p-2 font-mono rounded transition-colors ${role === r.value
                    ? "bg-amber-600 text-white"
                    : "bg-amber-400 hover:bg-amber-500"
                    }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          {/* Full Name */}
          <div className="flex flex-col w-full mt-6">
            <div className="flex items-center border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
              <FaUserCircle />
              <input
                type="text"
                {...register("fullName")}
                placeholder="Full Name"
                className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              />
            </div>
            {errors.fullName && (
              <span className="text-red-500 text-xs mt-1 ml-2">
                {errors.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col w-full mt-4">
            <div className="flex items-center border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
              <MdEmail />
              <input
                type="email"
                {...register("email")}
                placeholder="Email"
                className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 ml-2">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className="flex flex-col w-full mt-4">
            <div className="flex items-center border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
              <FaMobile />
              <input
                type="text"
                {...register("mobile")}
                placeholder="Mobile"
                className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              />
            </div>
            {errors.mobile && (
              <span className="text-red-500 text-xs mt-1 ml-2">
                {errors.mobile.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col w-full mt-4">
            <div className="flex items-center border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
              <RiLockPasswordFill />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2"
              >
                {showPassword ? <FaEyeSlash /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 ml-2">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? <ClipLoader size={20} /> : "Sign Up"}
          </button>

          {/* Google Sign-up */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/seller-delivery-signin" className="text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>

      {/* 🟣 OTP Verification Popup */}
      <Dialog open={showOtpModal}
        onOpenChange={(open) => {
          // Only allow closing if not via outside click
          if (!open) return; // ignore outside clicks
        }} modal>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your OTP</DialogTitle>
            <DialogDescription>
              Enter the 4-digit code sent to <b>{email}</b>.
            </DialogDescription>
          </DialogHeader>

          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onSubmitOtp)}
              className="w-full space-y-6 flex flex-col items-center justify-center"
            >
              <FormField
                control={otpForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center mb-3 uppercase">
                      Enter Your OTP
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={4} {...field}>
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
                      Please enter the one-time password sent to your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default SignUp;
