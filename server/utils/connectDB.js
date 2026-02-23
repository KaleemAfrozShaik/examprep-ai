import mongoose from "mongoose";

const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully");
    
  } catch (error) {
    console.log("DB Error");
    console.log(error);
  }
}

export default connectDB;