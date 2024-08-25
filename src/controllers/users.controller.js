import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.status(200).send({ users })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
};

export const createUser = async (req, res)=>{
    try {
        const {fname, email, password} = req.body
        if(!fname || !email || !password){
            return res.status(400).send({message: "All field are required"})
        }
        const exist = await User.findOne({email})
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

export const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).send({error: "Invalid credentials"})
        }
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET)
        return res.status(200).send({
            user,
            token,
            message: "success"
        })


    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}

export const updateUserName = async (req, res)=>{
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({message: "User not found"})
        }
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}