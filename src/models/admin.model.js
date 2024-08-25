import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema({})

export default mongoose.model("Admin", adminSchema)