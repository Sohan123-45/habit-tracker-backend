const {ImageKit}=require("@imagekit/nodejs");

const ImageKitClient=new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

async function uploadFile(file,mimetype){
    try{
        const extension = mimetype.split("/")[1];
        const fileName = `habit_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;
        const result=await ImageKitClient.files.upload({
            file,
            fileName,
            folder: "habit-tracker/habit"
        })
        return result;
    }catch(err){
        console.error("Upload Error:", err.message);
        throw new Error("File upload failed");
    }
}

async function deleteFile(fileId) {
    try {
    return await ImageKitClient.files.delete(fileId);
  } catch (err) {
    console.error("Delete Error:", err.message);
    throw new Error("File deletion failed");
  }
}

module.exports={uploadFile, deleteFile}