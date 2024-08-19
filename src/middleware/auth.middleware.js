import jwt from "jsonwebtoken";

export const authentication = (req, res, next)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ", '')
        if(!token){
            return res.status(401).send({message: "Unauthorized"})
        }
        
    } catch (error) {
        return res.status(401).send({message: "Not authorized, token faild"})
    }
}