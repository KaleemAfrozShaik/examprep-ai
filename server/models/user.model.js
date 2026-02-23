import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    minLength:6
  },
  credits:{
    type:Number,
    default:50,
    min:0
  },
  isCreditsAvailable:{
    type:Boolean,
    default:true
  },
  notes:{
    type: [mongoose.Schema.Types.ObjectId],
    ref:"Notes",
    default:[]
  }

},{timestamps:true})


//pass hashing middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// macth user entered password to hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
};


const userModel = mongoose.model("UserModel",userSchema)

export default userModel;