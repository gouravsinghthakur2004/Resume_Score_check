const mongoose =require("mongoose")

const mongoURI = process.env.MONGO_URI || process.env.MONGO_URI;

mongoose.connect(mongoURI).then((res)=>{
    console.log("Database connected successfully")

}).catch(err=>{
    console.log("Something went wrong",err)
})