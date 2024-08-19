export const adminAuth = (req, res, next)=>{
    try {
        if(req.user && req.user.role === 'admin'){
            next()
        }else{
            return res.status(403).send({message: "Access denied: Admins only"})
        }
    } catch (error) {
        return res.send({message: error.message})
    }
}