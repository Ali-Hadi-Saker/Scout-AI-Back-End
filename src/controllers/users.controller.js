import User from "../models/user.model.js"
import bcrypt from "bcrypt"

export const getUsers = async(res)=>{
    const users = User.find()
    return res.send(users)

}

export const createUser = async (req, res)=>{
    try {
        const {fname, email, password} = req.body
        if(!fname || !email || !password){
            return res.status(400).send({message: "All field are required"})
        }
        const exist = User.findOne({email})
        if(exist){
            return res.status(400).send({message: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            fname,
            email,
            password: hashedPassword
        })
        return res.status(201).send({
            user,
            message: "User created successfully"
        })
        
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}