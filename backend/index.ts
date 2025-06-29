import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { uploadToAutodesk } from "./upload";
import { UploadedFileData } from "./types";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.post("/webhook", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const imageFile = req?.file;
    const tags = req?.body?.tags;
    const text = req?.body?.text;
    const projectId = req?.body?.project_id;
    const folderPath = req?.body?.folder_path;

    if (!imageFile || !projectId || !folderPath) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const result = await uploadToAutodesk({
      imageFile,
      tags,
      text,
      projectId,
      folderPath,
    } as UploadedFileData);

    res.json({ message: "Image uploaded successfully", result });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => { console.log(`Application listening on port ${PORT}`) });
