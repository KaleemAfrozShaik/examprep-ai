import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import React from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      setLoading(true);

      const response = await axios.post(serverUrl +"/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(response.data.user));
      navigate("/"); 
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      console.log("Login failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full flex flex-col justify-center items-center p-8 md:p-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-black">
            ExamPrep <span className="text-gray-400">AI</span>
          </h2>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Hey there! 👋🏻
        </h2>

        <p className="text-center mb-6">
          Enter your email and password to Login.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email address"
            
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;