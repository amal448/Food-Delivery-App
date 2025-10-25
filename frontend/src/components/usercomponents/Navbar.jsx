import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { server } from '@/helpers/constants';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { setUserData, setCity } from '@/app/userSlice';
import {
    AlertDialog,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import LocationChange from './LocationChange';


const Navbar = () => {
    const name = useSelector((state) => state.user.userData)
    const city = useSelector((state) => state.user.city)
    const count = useSelector((state) => state.user.CartCount)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            console.log("hiii");

            const { data } = await axios.get(`${server}/api/auth/signout`, { withCredentials: true })
            navigate('/signin')
            dispatch(setUserData(null))
            dispatch(setCity(null))
        }
        catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='fixed top-0 left-0 z-50 w-full overflow-hidden backdrop-blur-sm bg-[#ff4d2d]/80 '>

            <div className='w-full flex justify-between gap-7 items-center py-4 px-6 md:px-20 lg:px-32 mx-auto overflow-hidden'>
                <Link to={'/'} >
                    <svg width="49" height="40" viewBox="0 0 49 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.3947 40C43.8275 39.8689 49 34.6073 49 28.1389C49 24.9931 47.7512 21.9762 45.5282 19.7518L25.7895 0V12.2771C25.7895 14.3303 26.6046 16.2995 28.0556 17.7514L32.6795 22.3784L32.6921 22.3907L40.4452 30.149C40.697 30.4009 40.697 30.8094 40.4452 31.0613C40.1935 31.3133 39.7852 31.3133 39.5335 31.0613L36.861 28.3871H12.139L9.46655 31.0613C9.21476 31.3133 8.80654 31.3133 8.55476 31.0613C8.30297 30.8094 8.30297 30.4009 8.55475 30.149L16.3079 22.3907L16.3205 22.3784L20.9444 17.7514C22.3954 16.2995 23.2105 14.3303 23.2105 12.2771V0L3.47175 19.7518C1.24882 21.9762 0 24.9931 0 28.1389C0 34.6073 5.17252 39.8689 11.6053 40H37.3947Z" fill="#FF0A0A"></path>
                    </svg>
                </Link>
                <div className='hidden md:flex py-2 px-8 items-center gap-20 flex-1 h-15 shadow-lg '>
                    <div className='flex items-center gap-2'>
                        <AlertDialog>
                            <AlertDialogTrigger  >
                                <div className='flex justify-center items-center gap-3'>
                                    <FaLocationDot size={20} color={"orange"} />
                                    <span>
                                        {city}
                                    </span>
                                </div>
                            </AlertDialogTrigger>
                            <LocationChange />
                        </AlertDialog>
                    </div>

                    <div className='flex items-center gap-2 px-4 border-l-2 border-gray-400'>
                        <IoIosSearch size={20} />
                        <input type="text" placeholder='Search dilicious food' className='outline-none' />
                    </div>
                </div>
                <div className='flex items-center justify-center gap-6'>

                    <div className='relative' onClick={() => navigate('/cart')}>
                        <FiShoppingCart size={20} />
                        <span className='absolute -top-5 -right-3 px-1 rounded-md bg-amber-300'>{count}</span>
                    </div>

                    <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-yellow-300 text-sm font-medium'>My Orders</button>

                    <DropdownMenu>
                        <DropdownMenuTrigger className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer'>
                            {name?.fullName?.slice(0, 1)}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleLogOut()}>LogOut</DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
            <div className='w-full flex md:hidden py-2 px-8 items-center gap-20 flex-1 h-15 shadow-2xl '>
                <div className='flex items-center gap-2'>
                    <FaLocationDot size={20} color={"orange"} />
                    <span>
                        {city}
                    </span>
                </div>

                <div className='flex flex-1 min-w-0 items-center gap-2 px-4 border-l-2 border-gray-400'>
                    <IoIosSearch size={20} />
                    <input type="text" placeholder='Search dilicious food' className='outline-none w-full min-w-0' />
                </div>
            </div>
        </div>

    )
}

export default Navbar