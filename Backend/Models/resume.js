const mongoose=require("mongoose")

const Resumeschema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,

    },
    resume_name:{
        type:String,
        required:true,
    },
    job_Desc:{
        type:String,
        required:true,
    },
    score:{
        type:String,
    },
    feedback:{
        type:String,
    },
},{timestamps:true});

const resumeModel =mongoose.model("resume",Resumeschema);

module.exports = resumeModel;