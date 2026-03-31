function authorizeRoles(...assignRoles){
    return (req,res,next)=>{
        if(!assignRoles.includes(req.user.role)){
            return res.status(403).json({message:"Forbidden"});
        }
        next();
    };
}

module.exports={authorizeRoles}