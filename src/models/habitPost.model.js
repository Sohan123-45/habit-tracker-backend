const mongoose=require('mongoose');

const habitPostSchema=new mongoose.Schema({
    habit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"habit",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    uri:{
        type:String,
        required:true
    },
    fileId: {
        type: String,
        required: true
    },
    title:{
        type:String,
        required:true,
        trim: true
    },
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:true
});

const habitPostModel=mongoose.model("habitPost",habitPostSchema);

module.exports=habitPostModel;