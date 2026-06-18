const ResumeModel = require("../Models/resume")
const UserModel = require("../Models/user")

const pdfParse = require("pdf-parse");
const path=require("path");
const {CohereClient}=require("cohere-ai");

const cohere=new CohereClient({
    token:process.env.COHERE_API_KEY
});








exports.addResume=async(req,res)=>{
    let pdfPath = null;
    try{
        if (!req.file) {
            return res.status(400).json({ error: "bad request", message: "No resume PDF file uploaded." });
        }
        pdfPath = req.file.path;

        const{job_desc,user}=req.body;
        if (!job_desc || !user) {
            return res.status(400).json({ error: "bad request", message: "Job description and User ID are required." });
        }

        const fs=require("fs");
        const dataBuffer =fs.readFileSync(pdfPath);
        const pdf = await pdfParse(dataBuffer);
        console.log("PDF parsed successfully. Length:", pdf.text.length);

        const prompt =`
        You are a resume screening assistant.
        Compare the following resume text with the provided Job Description (JD) and give a match score (0-100) and feedback

        Resume:
        ${pdf.text}

        Job Description:
        ${job_desc}

        Return the score and a brief explanation in this format:
        Score:xx
        Reason: ...
        `;
        
        let response;
        let lastError;
        const modelsToTry = ["command-r-08-2024", "command-r-plus-08-2024", "command-a-03-2025"];
        for (const model of modelsToTry) {
            try {
                console.log(`Attempting Cohere chat with model: ${model}`);
                response = await cohere.chat({
                    model: model,
                    message: prompt,
                    temperature: 0.7,
                });
                console.log(`Cohere chat succeeded with model: ${model}`);
                break;
            } catch (err) {
                console.error(`Cohere chat failed with model: ${model}. Error:`, err.message || err);
                lastError = err;
            }
        }

        if (!response) {
            throw lastError || new Error("Failed to generate response from all tried Cohere models.");
        }

        const result = response.text;

        const match = result.match(/score:\s*(\d+)/i);
        const score = match ? parseInt(match[1], 10) : null;

        const reasonMatch = result.match(/reason:\s*(.*)/is);
        const reason = reasonMatch ? reasonMatch[1].trim() : result;

        const newResume=new ResumeModel({
            user,
            resume_name:req.file.originalname,
            job_Desc:job_desc,
            score: score !== null ? String(score) : "0",
            feedback: reason
        });

        await newResume.save();

        res.status(200).json({message:"your analysis are ready",data:newResume});

    }catch(err){
        console.log(err)
        res.status(500).json({error:'server error',message:err.message});
    }finally{
        if (pdfPath) {
            const fs = require("fs");
            if (fs.existsSync(pdfPath)) {
                try {
                    fs.unlinkSync(pdfPath);
                    console.log("Temp resume file deleted successfully.");
                } catch (unlinkErr) {
                    console.error("Error deleting temp file:", unlinkErr);
                }
            }
        }
    }
}

exports.getAllResumeForUser=async(req,res)=>{
    try{
        const {user}=req.params;
        const callerId = req.headers['x-user-id'];

        if (!callerId) {
            return res.status(401).json({ error: "Unauthorized", message: "User identification header missing." });
        }

        // Verify if caller is the target user OR is an admin
        if (callerId !== user) {
            const caller = await UserModel.findById(callerId);
            if (!caller || caller.role !== 'admin') {
                return res.status(403).json({ error: "Access denied", message: "You are not authorized to view this user's history." });
            }
        }

        let resumes=await ResumeModel.find({user:user}).sort({createdAt:-1});
        return res.status(200).json({message:"your previous History",resumes:resumes});

    }catch(err){
        console.log(err)
        res.status(500).json({error:'server error',message:err.message});
    }

}

exports.getResumeForAdmin=async(req,res)=>{
    try{
        const callerId = req.headers['x-user-id'];
        if (!callerId) {
            return res.status(401).json({ error: "Unauthorized", message: "User identification header missing." });
        }

        const caller = await UserModel.findById(callerId);
        if (!caller || caller.role !== 'admin') {
            return res.status(403).json({ error: "Access denied", message: "Only admins are allowed to access this resource." });
        }

        let resumes=await ResumeModel.find({}).populate("user").sort({createdAt:-1});
        return res.status(200).json({message:"your  all History",resumes:resumes});

    }catch(err){
        console.log(err)
        res.status(500).json({error:'server error',message:err.message});
    }
}

exports.deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const callerId = req.headers['x-user-id'];

        if (!callerId) {
            return res.status(401).json({ error: "Unauthorized", message: "User identification header missing." });
        }

        const caller = await UserModel.findById(callerId);
        if (!caller || caller.role !== 'admin') {
            return res.status(403).json({ error: "Access denied", message: "Only admins are allowed to delete records." });
        }

        const deletedResume = await ResumeModel.findByIdAndDelete(id);
        if (!deletedResume) {
            return res.status(404).json({ error: "Not found", message: "Resume record not found." });
        }

        return res.status(200).json({ message: "Record deleted successfully", data: deletedResume });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error', message: err.message });
    }
};