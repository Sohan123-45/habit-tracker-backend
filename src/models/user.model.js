const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin','owner'],
        default:'user'
    },
    isBanned:{
        type:Boolean,
        default:false 
    }
},{timestamps: true});

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;