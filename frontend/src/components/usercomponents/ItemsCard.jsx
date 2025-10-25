import React, { useState, useEffect } from 'react'
import { setCartItems } from '@/app/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const ItemsCard = ({ data }) => {
    const [count, setCount] = useState(0);
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.user.CartItems);
    console.log(data);

    const product = {
        id: data._id,
        name: data.name,
        category: data.category,
        price: data.price,
        rating: 4,
        image: data.image,
        shop: data.shop,
        quantity: count
    };

    useEffect(() => {

        const existingItem = cartItems?.find((item) => item.id === data._id);
        if (existingItem) {
            setCount(existingItem.quantity);
        } else {
            setCount(0);
        }
    }, [cartItems, data._id]);

    return (
        <div className="border min-h-52 border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="h-40 group relative cursor-pointer flex items-center justify-center px-2">
                <img className=" group-hover:scale-105 transition w-full h-full rounded-lg" src={product.image} alt={product.name} />
                <div className="text-indigo-500 absolute top-0 right-2">
                    {count === 0 ? (
                        <button className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium" onClick={() => {
                            const newCount = count + 1;
                            setCount(newCount)
                            dispatch(setCartItems({ ...product, quantity: newCount }));
                        }
                        } >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Add
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-100 rounded select-none">
                            <button onClick={() => {
                                const newCount = Math.max(count - 1, 0);
                                setCount(newCount);
                                dispatch(setCartItems({ ...product, quantity: newCount }));
                            }} className="cursor-pointer text-md px-2 h-full" >
                                -
                            </button>
                            <span className="w-5 text-center">{count}</span>
                            <button onClick={() => {
                                const newCount = count + 1; // compute new count
                                setCount(newCount);
                                dispatch(setCartItems({ ...product, quantity: newCount }));
                            }
                            } className="cursor-pointer text-md px-2 h-full" >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col justify-between items-start text-gray-500/60 text-sm py-2 px-2 mt-2">
                <div>
                    <p>{product.category}</p>
                    <p className="text-gray-700 font-medium text-lg truncate w-full ">{product?.name}</p>
                    <p className="text-black font-bold bg-yellow-200 p-1 w-fit">
                        Shop: {product?.shop?.name || 'No shop name found'}
                    </p>
                </div>

                <div className="flex items-end gap-2 mt-3">
                    <p className="md:text-xl text-base font-medium text-indigo-500">
                        ₹{' '}{product.price} Only
                    </p>

                </div>
            </div>
        </div>
    )
}

export default ItemsCard