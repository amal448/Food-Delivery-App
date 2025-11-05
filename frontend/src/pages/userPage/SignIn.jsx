import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEyeSlash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase.js";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "@/app/userSlice";
import { useNavigate } from "react-router-dom";
import { server } from "@/helpers/constants.js";

// ✅ Validation schema
const signInSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // ✅ useForm setup
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signInSchema),
    });

    // ✅ Submit handler
    const onSubmit = async (data) => {
        console.log("server",server);
        try {
            
            const res = await axios.post(
                // "http://localhost:8000/api/auth/signin",
                `${server}/api/auth/signin`,
                data,
                { withCredentials: true }
            );
            dispatch(setUserData(res.data))
            navigate('/')
            console.log("Login success:", res.data);
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
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
            if (res?.data) {
                dispatch(setUserData(res.data));
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.log("Google Auth Error:", error);
        }
    };
    return (
        <div className="flex h-screen max-w-7xl mx-auto py-5">
            {/* Left image section */}
            <div className="w-full hidden md:inline-block">
                <img
                    className="h-full"
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
                    alt="leftSideImage"
                />
            </div>

            {/* Right form section */}
            <div className="w-full flex flex-col items-center justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="md:w-96 w-80 flex flex-col items-center justify-center"
                >
                    <h2 className="text-4xl text-gray-900 font-medium uppercase">
                        Sign In
                    </h2>
                    <p className="text-sm text-gray-500/90 mt-3">
                        Welcome back! Please sign in to continue
                    </p>

                    {/* Email field */}
                    <div className="flex flex-col w-full mt-6">
                        <div className="flex items-center bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <MdEmail />
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Email"
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            />
                        </div>
                        {errors.email && (
                            <span className="text-red-500 text-xs mt-1 ml-2">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col w-full mt-6">
                        <div className="flex items-center bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <RiLockPasswordFill />
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Password"
                                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                            />
                            <button
                                type="button"
                                className="p-2"
                                onClick={() => setShowPassword(!showPassword)}
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

                    {/* Remember me + Forgot password */}
                    <div className="w-full flex items-center justify-end mt-8 text-gray-500/80">


                        <Link to="/forgot-password" className="text-sm underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                        {isSubmitting ? <ClipLoader size={20} /> : "Login"}
                    </button>

                    {/* Google auth button */}
                    <button
                        onClick={handleGoogleAuth}
                        type="button"
                        className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
                    >
                        <img
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
                            alt="googleLogo"
                        />
                    </button>

                    <p className="text-gray-500/90 text-sm mt-4">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-indigo-400 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
