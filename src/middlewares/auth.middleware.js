const jwt=require("jsonwebtoken");
const userModel=require("../models/user.model");

async function isAuthenticated(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={
            id: decoded.id,
            role: decoded.role
        };

        const user=await userModel.findById(decoded.id);
        if(!user||user.isBanned){
            return res.status(403).json("Unauthorized");
        }

        next();
    }
    catch(err){
        console.error("JWT Error:", err.message);
        return res.status(401).json({message:"Unauthorized"});
    }
}

module.exports={isAuthenticated}