const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs");

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

// Multer config
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => cb(null, "uploads/"), 
    filename: (req, file, cb) => {
        // FIXED: Changed 'filemane' to 'filename'
        // FIXED: Capitalised 'Date.now()'
        // FIXED: Corrected 'file.orinalname' to 'file.originalname'
        cb(null, Date.now() + path.extname(file.originalname));
    } 
}); 

const fileFilter = (req, file, cb) => { 
    if (file.mimetype === "application/pdf") {
        cb(null, true); 
    } else {
        cb(new Error("Only PDF allowed"), false);
    }
}; 

// FIXED: Corrected spelling from 'exports.uplaod' to 'exports.upload'
exports.upload = multer({ storage, fileFilter });
