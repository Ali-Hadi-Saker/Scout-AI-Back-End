import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: "admin"
})

export default mongoose.model("Admin", adminSchema)