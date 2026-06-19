const mongoose =require("mongoose")

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("MONGO_URI environment variable is missing.");
} else {
    mongoose.connect(mongoURI).then((res)=>{
        console.log("Database connected successfully")
    }).catch(err=>{
        console.log("Something went wrong",err)
    });
}