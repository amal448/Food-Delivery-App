import SignIn from './pages/userPage/SignIn'
import SignUp from "./pages/userPage/SignUp"
import ForgotPage from "./pages/ForgotPage"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import useGetCurrentUser from "./hooks/useGetCurrentUser.js"
import { useSelector } from "react-redux"
import Layout from "./pages/userPage/Layout"
import Home from "./pages/userPage/Home"
import useGetCity from "./hooks/useGetCity"
import DeliverySignIn from './pages/SignIn'
import DeliverySignUp from './pages/SignUp'
import SellerDashBoard from './pages/ownerPage/DashBoard'
import OwnerLayout from './pages/ownerPage/OwnerLayout'
import { FaInfoCircle } from "react-icons/fa";
import UseGetMyShop from './hooks/useGetMyShop'
import Myshop from './pages/ownerPage/Myshop'
import ShopDetails from './pages/ownerPage/ShopDetails'
import ViewItems from './components/tanstacktable/page'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import useGetShopsByCity from './hooks/useGetShopsByCity'
import useGetNearByShops from './hooks/useGetShopsByCity'
import CartPage from './pages/userPage/CartPage'
import CheckOut from './pages/userPage/CheckOut'
import OrderPlaced from './pages/userPage/OrderPlaced'
import UseGetMyOrders from './hooks/useGetMyOrders'
import MyOrders from './pages/userPage/MyOrders'
import OrderList from './components/ownercomponents/OrderList'
import DeliveryPageLayout from './pages/deliveryBoy/DeliveryPageLayout'
import DeliveryDashBoard from './pages/deliveryBoy/DashBoard'
import { useEffect } from 'react'
import TaskViewPage from './pages/deliveryBoy/TaskViewPage'
import TrackOrderPage from './pages/userPage/TrackOrderPage'
// import useAuthInitializer from "@/hooks/useAuthInitializer";
import ViewShopdetails from './pages/userPage/ViewShopdetails'

const App = () => {
  const { userData } = useSelector(state => state?.user)
  const mapState = useSelector(state => state.map)
  // useAuthInitializer();
  // ✅ Call hooks unconditionally
  useGetCurrentUser()
  useGetCity()
  UseGetMyShop()
  useGetItemsByCity()
  useGetShopsByCity()
  useGetNearByShops()
  UseGetMyOrders()

  useEffect(() => {
    // console.log("Map state updated:", mapState)
  }, [mapState])

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          success: { icon: <FaInfoCircle className="text-green-500" /> },
          error: { icon: <FaInfoCircle className="text-red-500" /> },
        }}
      />
      <Routes>
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={'/'} />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={'/'} />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/" element={!userData ? <Navigate to={'/signin'} /> : <Layout />}>
          <Route path='' element={<Home />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckOut />} />
          <Route path="order-success" element={<OrderPlaced />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="/track-order/:orderId" element={userData ? <TrackOrderPage /> : <Navigate to={'/'} />} />
          <Route path="view-shop-items/:shopId" element={<ViewShopdetails />} />
        
        
        </Route>

        <Route
          path="/seller-delivery-signup"
          element={
            !userData ? (
              <DeliverySignUp />
            ) : userData.role === "deliveryBoy" ? (
              <Navigate to="/delivery" />
            ) : (
              <Navigate to="/seller" />
            )
          }
        />
        <Route
          path="/seller-delivery-signin"
          element={
            !userData ? (
              <DeliverySignIn />
            ) : userData.role === "deliveryBoy" ? (
              <Navigate to="/delivery" />
            ) : (
              <Navigate to="/seller" />
            )
          }
        />

        <Route
          path="/seller"
          element={
            userData && userData.role === "owner" ? (
              <OwnerLayout />
            ) : (
              <Navigate to="/seller-delivery-signup" />
            )
          }
        >
          <Route index element={<SellerDashBoard />} />
          <Route path="shops" element={<Myshop />} />
          <Route path="shop-details/:id" element={<ShopDetails />} />
          <Route path="view-Item/:id" element={<ViewItems />} />
          <Route path="view-orders" element={<OrderList />} />
        </Route>

        <Route
          path="/delivery"
          element={
            userData && userData.role === "deliveryBoy" ? (
              <DeliveryPageLayout />
            ) : (
              <Navigate to="/seller-delivery-signup" />
            )
          }
        >
          <Route index element={<DeliveryDashBoard />} />
          <Route path="view-tasks" element={<TaskViewPage />} />
          {/* <Route path="shop-details/:id" element={<ShopDetails />} />
          <Route path="view-Item/:id" element={<ViewItems />} />
          <Route path="view-orders" element={<OrderList />} /> */}
        </Route>
      </Routes>
    </>
  )
}

export default App
