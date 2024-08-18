import User from "../models/user.model.js"

export const getUser = async(res)=>{
    const users = User.find()
    return res.send(users)

}