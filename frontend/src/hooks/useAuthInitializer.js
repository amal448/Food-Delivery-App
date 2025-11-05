// // src/hooks/useAuthInitializer.js
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setUserData } from "@/app/userSlice";

// const useAuthInitializer = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // detect role based on current path (you can adjust this)
//     let role = "user";
//     const path = window.location.pathname;

//     if (path.includes("owner")) role = "owner";
//     else if (path.includes("delivery")) role = "deliveryBoy";

//     const storedAuth = sessionStorage.getItem(`auth_${role}`);
//     if (storedAuth) {
//       const parsed = JSON.parse(storedAuth);
//       dispatch(setUserData(parsed)); // directly set user data
//     }
//   }, [dispatch]);
// };

// export default useAuthInitializer;
