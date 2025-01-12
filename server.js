const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser=require('body-parser');
const details=require('./text.json');
const app = express();

// Ensure the uploads directory exists



// Middleware
app.use(cors(({
  origin:"*"
})));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer setup for single file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, Date.now() + "-" + file.originalname); // Unique file names
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/; // Allowed file types
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});
app.get('/data',(req,res)=>{
  return res.status(201).json(details);
})
// Route to handle single file upload
app.post("/upload", upload.single("image"), (req, res) => {
  const image={
    data:req.file.path
  }
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
console.log(req.file.path)
details.push(image);
fs.writeFile("./text.json",JSON.stringify(details),(err)=>{
  if(err)
  console.log(err)
});
  return res.json({
    message: "File uploaded successfully!",
    filePath: `http://localhost:8000/uploads/${req.file.filename}`,
  });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});