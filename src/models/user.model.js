import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    fname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    profilePicture: String,
    createdAt:{ 
        type: Date, 
        default: Date.now },  
    updatedAt:{ 
        type: Date, 
        default: Date.now },
})

export default mongoose.model("User", userSchema)