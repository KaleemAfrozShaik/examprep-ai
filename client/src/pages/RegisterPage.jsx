import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/auth/register",
        { name, email, password }
      );
      dispatch(setUserData(response.data.user));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
          <h2 className="text-2xl font-extrabold">
            ExamPrep
            <span className="text-gray-400"> AI</span>
          </h2>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Hey there! 👋🏻</h2>

        <p className="text-center mb-6">
          Fill the details below to get started.
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Create a password"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
