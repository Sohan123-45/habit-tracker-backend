const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

async function registerUser(req,res){
    try {    
        const { username, email, password } = req.body;
        const hash=await bcrypt.hash(password,10);
    
        const user=await userModel.create({
            username,
            email,
            password:hash,
            role: "user"
        })
    
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
    
        return res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function loginUser(req,res){
    try {
        const {username, password}=req.body;
        const email=username;

        const user=await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });
        if(!user||user.isBanned){
            return res.status(401).json({
                message:"Invalid Credentials or Unauthorized"
            })
        }
    
        const isPasswordValid=await bcrypt.compare(password,user.password);
    
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid Credentials"
            })
        }
    
        const token=jwt.sign({
            id:user._id,
            role:user.role
        },process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );
    
        res.status(200).json({
            message:"Login Successful",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
            },
            token
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function logoutUser(req,res){
    return res.status(200).json({
        message: "Logged out successfully"
    });
}

module.exports={registerUser, loginUser,logoutUser}