
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import cors from "cors"


const app = express();
app.use(express.json);
app.use(express.urlencoded({ extended: true }));

app.use(cors({

    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));


cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''


});
//? mullter setup

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/src/public/image");
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(12, (err, byte) => {
            const fn = byte.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        })
    }
})

const uploade = multer({ storage });


app.post("/uploade", uploade.single("avtar"), async (req, res) => {
    if (!req.file) {
        return res.status(401).json({ message: "file not uploades" });
    }

    try {
        const uploaderesult = await cloudinary.uploader.upload(req.file.path);

        //? unlink or delete t he files;

        try {
            fs.unlink(req.file.path);
            res.json("successfull deleted from you folder ")
            
        } catch (err) {
            return res.json("file not deleted")
        }
        res.json({ message: "Upload successful", url: uploaderesult.secure_url });

        
    }
    catch (err) {
        console.log({mesage:"not uploade successfully"|| err.message})
    }
})














app.listen(3000, () => {
    console.log(`your server is runnin on port 3000`);
})