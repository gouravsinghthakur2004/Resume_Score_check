const express=require("express")
const router=express.Router();
const multer = require('multer');
const ResumeController=require("../Controllers/resume")

const {upload} = require('../utils/multer')


router.post("/addResume",upload.single("resume"),ResumeController.addResume )
router.get("/get/:user",ResumeController.getAllResumeForUser)
router.get('/get',ResumeController.getResumeForAdmin)
router.delete("/delete/:id",ResumeController.deleteResume)

module.exports = router;