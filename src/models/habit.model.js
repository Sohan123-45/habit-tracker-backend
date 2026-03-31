const mongoose=require("mongoose");

const habitSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim: true
    },
    color:{
        type:String,
        default: "#FFB347",
        match: [/^#([0-9A-F]{3}){1,2}$/i,"Please enter a valid hex color"]
    },
    count:{
        type:Number,
        default:0,
        min:0
    },
    streak:{
        type:Number,
        default:0,
        min:0
    },
    longestStreak:{
        type:Number,
        default:0,
        min:0
    },
    lastEntryDate:{
        type:Date,
        default: null
    }
},{ timestamps: true });

//prevent habit duplication
habitSchema.index({ user: 1, name: 1 }, { unique: true });

const habitModel=mongoose.model("habit",habitSchema);

module.exports=habitModel;