const userModel=require('../models/user.model')

async function validateRegister(req,res,next){
    try{
        const {username, email, password, role="user"}=req.body;
    
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        const isUserAlreadyExists=await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(isUserAlreadyExists){
            return res.status(409).json({message:"User Already Exists"});
        }
        if(username.length<3) return res.status(400).json({message:"Username must be greater than 3 characters"});

        let passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(!passwordRegex.test(password)) return res.status(400).json({message:"Password must contain 1 small and 1 capital letter, 1 special character, 1 number and length should be greater than 8"})
        next();
    }
    catch(err){
        console.log(err);
    }
}

module.exports=validateRegister