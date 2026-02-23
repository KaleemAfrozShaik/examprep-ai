import User from '../models/user.model.js'
import jwt from 'jsonwebtoken';


export async function register(req, res) {
  const { name, email, password } = req.body;
  try {
    if(!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if(password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists, please use a different one.' });
    }

    const newUser = await User.create({
      name,
      email,
      password
    });

    const token=jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    newUser.password = undefined; // we should not expose password
    res.status(201).json({
      success: true,
      user: newUser
    });

  } catch (error) {
    console.log('Error during registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req, res) {
  try {
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:"All fields are required"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({message:"Invalid Email or password" });
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect){
      return res.status(401).json({message:"Invalid email or Password" });
    }
    const token=jwt.sign({ userId:user._id},process.env.JWT_SECRET,{
      expiresIn:"7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    user.password = undefined;
    res.status(200).json({success:true,user});
  } catch (error) {
    console.log("Error in login controller",error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}

export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
}

