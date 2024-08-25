import mongoose from "mongoose";


const connectToDatabase = async ()=>{
    mongoose.connect(process.env.DATABASE_URL)    
    console.log("connected to database");
    
}

export default connectToDatabase