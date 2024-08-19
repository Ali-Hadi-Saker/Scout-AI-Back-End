import jwt from "jsonwebtoken";

export const authentication = (req, res, next)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ", '')
        if(!token){
            return res.status(401).send({message: "Unauthorized"})
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err) return res.status(403)
            req.user = user
        next()
        })

    } catch (error) {
        return res.status(401).send({message: "Not authorized, token faild"})
    }
}