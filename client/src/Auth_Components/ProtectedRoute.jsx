import { useEffect } from "react";
import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function ProtectedRoute() {
  const {isLoggedIn} = useSelector(state => state.user);
  const navigate = useNavigate();


    useEffect(() => {
      if(isLoggedIn == false){
        toast.error(`Login required to visit this page`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
        });
        navigate("/login");
      }
    }, [navigate]);  


  
  return <Outlet />

}
