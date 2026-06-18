const UserModel=require("../Models/user")


exports.register=async(req,res)=>{

    try{

        const {name,email,photoUrl}=req.body;
        const role = (email.toLowerCase().includes("admin") || email === "thakursinghgourav@gmail.com") ? "admin" : "user";
        const userExist=await UserModel.findOne({email:email});
        if(!userExist){
            let newUser =new UserModel({name,email,photoUrl,role});
            await newUser.save();
            return res.status(200).json({
                message:"user registered Successfully",
                user:newUser
            })
        }
        
        // Update photoUrl or role if they changed
        let updated = false;
        if (photoUrl && userExist.photoUrl !== photoUrl) {
            userExist.photoUrl = photoUrl;
            updated = true;
        }
        if (userExist.role !== role) {
            userExist.role = role;
            updated = true;
        }
        if (updated) {
            await userExist.save();
        }
        
        return res.status(200).json({
            message:"WELCOME back",
            user:userExist
        })

    }catch(err){
        console.log(err)
        res.status(500).json({error:'server error',message:err.message});
    }
}