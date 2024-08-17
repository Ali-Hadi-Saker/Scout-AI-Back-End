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
    profilePicture: {
        type: String
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },  
    updatedAt:{ 
        type: Date, 
        default: Date.now 
    },
    cars:[{
        carId: String,
        status: String,
        batteryLevel: Number,
        cameraFeed: String,
        createdAt:{
            type: Date,
            default: Date.now,
        },
        updatedAt:{
            type: Date,
            default: Date.now
        },
        location:{
            latitude: Number,
            longitude: Number
        },
        images:[{
            imageId: String,
            imageURL: String,
            uploadedAt:{
                type: Date,
                default: Date.now
            },
            objectDetectionResults:{
                objectName: String,
                confidence: Number
            }
        }]
    }]

})

export default mongoose.model("User", userSchema)