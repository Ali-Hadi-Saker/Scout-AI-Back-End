import User from "../models/user.model.js"

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
        
    } catch (error) {
        return res.status(500).send({message: error.message})
    }
}