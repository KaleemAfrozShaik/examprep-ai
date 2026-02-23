import {Navigate, Route,Routes} from "react-router-dom";
import Home from './pages/Home';
import Auth from './pages/Auth';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect } from "react";
import { getCurrentUser } from "../src/services/api.js";
import { useDispatch, useSelector } from "react-redux";
import History from "./pages/History.jsx";
import Notes from "./pages/Notes.jsx";
import Pricing from "./pages/Pricing.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import { motion } from "motion/react";


const App =  () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const user = getCurrentUser(dispatch);
  },[dispatch])
  const {userData,loading} = useSelector((state)=>state.user);
  // console.log("User :",userData);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-2xl font-bold animate-pulse text-black">
          ExamPrep <span className="text-gray-400">AI</span>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-black-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }
  return (
    <>
    <Routes>
      <Route path="/" element={userData?<Home/>:<Navigate to={'/auth'} replace/>}/>
      <Route path="/auth" element={userData?<Navigate to={'/'} replace/>:<Auth/>}/>
      <Route path="/login" element={userData?<Navigate to={'/'} replace/>:<LoginPage/>} />
      <Route path="/register" element={userData?<Navigate to={'/'} replace/>:<RegisterPage/>} />
      <Route path="/history" element={userData?<History/>:<Navigate to={'/auth'} replace/>}/>
      <Route path="/notes" element={userData?<Notes/>:<Navigate to={'/auth'} replace/>}/>
      <Route path="/pricing" element={userData?<Pricing/>:<Navigate to={'/auth'} replace/>}/>
      <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
    </Routes>
    </>
  );
};


export default App;
