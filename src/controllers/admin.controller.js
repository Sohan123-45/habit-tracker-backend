const userModel=require("../models/user.model");
const habitModel=require("../models/habit.model");
const habitPostModel=require("../models/habitPost.model");

async function banUser(req,res){
    try{
        const {userId}=req.params;
        const currentUser=req.user;

        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        if(user.isBanned){
            return res.status(400).json({message:"User already banned"});
        }
        if(user.role==="owner"){
            return res.status(403).json({message:"Cannot ban Owner"});
        }
        if(userId===req.user.id){
            return res.status(400).json({message:"You cannot ban yourself"});
        }
        if(currentUser.role==="admin" && user.role==="admin"){
            return res.status(403).json({message:"Admins cannot ban Admins"});
        }
        user.isBanned=true;
        await user.save();

        return res.json({message:"User banned successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function unbanUser(req,res){
    try{
        const {userId}=req.params;
        const currentUser=req.user.id;

        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(!user.isBanned){
            return res.status(400).json({message:"User already unbanned"});
        }
        if(currentUser.role==="admin" && user.role==="admin"){
            return res.status(403).json({message:"Admin cannot Unban Admin"});
        }
        user.isBanned=false;
        await user.save();

        return res.json({message:"User unbanned successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getAllData(req,res){
    try{
        const {userId}=req.params;
    
        const user=await userModel.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User Not found"});
        }
    
        const habits=await habitModel.find({user:userId});
    
        const posts=await habitPostModel.find({user:userId}).sort({date:-1});

        return res.status(200).json({
            message: "User data fetched successfully",
            user,
            habits,
            posts
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getUsers(req,res){
    try{
        const users=await userModel.find();
        if(!users){
            return res.json({message:"No users found"});
        }
        return res.status(200).json({
            message:"Users fetched successfully",
            users
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function makeAdmin(req,res){
    try{
        const {userId}=req.params;
    
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json("User Not Found");
        }
        if(user.role==="admin"){
            return res.status(400).json({message:"User already is an Admin"});
        }

        user.role="admin";
        await user.save();
        return res.json({message:"User made to Admin Successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function removeAdmin(req,res){
    try{
        const {userId}=req.params;

        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not Found"});
        }
        if(user.role==="user"){
            return res.status(400).json({message:"User is already not an Admin"});
        }

        user.role="user";
        await user.save();
        
        return res.json({message:"Admin access removed"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports={banUser,unbanUser,getAllData,getUsers,makeAdmin,removeAdmin}