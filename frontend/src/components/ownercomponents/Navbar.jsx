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
import { useNavigate } from 'react-router-dom';
import { setUserData, setCity } from '@/app/userSlice';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { logoutUser } from "@/app/userSlice";
import { persistor } from '@/app/store';
import { resetMapState } from '@/app/mapSlice';

const Navbar = () => {
    const name = useSelector((state) => state.user.userData)
    const city = useSelector((state) => state.user.city)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            // console.log("hiii");

            const { data } = await axios.get(`${server}/api/auth/signout`, { withCredentials: true })
            navigate('/signin')
            dispatch(setUserData(null))
            dispatch(setCity(null))
            dispatch(logoutUser()); // Clear user slice
            dispatch(resetMapState()); // Clear user slice

            persistor.purge(); // 💥 Clear redux-persist storage completely
            navigate('/signin');
        }
        catch (error) {
            console.log(error);

        }
    }

    return (
        <div className='w-full flex justify-between items-center overflow-hidden'>

            <div className='w-full flex justify-between gap-7 items-center py-4 px-6  mx-auto overflow-hidden'>
                <SidebarTrigger />


                <div className='flex items-center justify-center gap-6'>

                    <span>
                        <FiShoppingCart size={20} />
                    </span>

                    <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium'>My Orders</button>

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



        </div>

    )
}

export default Navbar