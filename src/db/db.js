const mongoose=require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
    }
    catch(err){
        console.log("Database Connection Error: ",err);
        throw err;
    }
}

module.exports=connectDB