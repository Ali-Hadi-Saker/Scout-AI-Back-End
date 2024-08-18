import User from "../models/user.model.js"

export const getUsers = async(res)=>{
    const users = User.find()
    return res.send(users)

}