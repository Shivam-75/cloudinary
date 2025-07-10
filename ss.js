import express from "express";
import multer from "multer";
import crypto from "crypto"
import path from "path";
import cors from "cors"
import fs from "fs/promises"
import { v2 as cloudinary } from 'cloudinary';



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(cors({
    origin: "",
    methods: ["GET", "POST"],
    credentials: true
}));
// Configuration
cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''


});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public/image")
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(12, (error, byte) => {
            const fn = byte.toString("hex") + path.extname(file.originalname);
            cb(null, fn);


        })
    }
})
const upload = multer({ storage });

app.post("/upload", upload.single("avatar"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        try {
            await fs.unlink(req.file.path);
            console.log("Deleted local file:", req.file.path);
        } catch (unlinkError) {
            console.error("Failed to delete file:", unlinkError);
        }
        res.json({ message: "Upload successful", url: uploadResult.secure_url });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message || "Upload failed" });
    }
});


app.listen(8080, () => {
    console.log(`server is runnin on port no http://localhost:8080`)
})