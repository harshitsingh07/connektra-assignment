"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const upload_1 = require("./upload");
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 5000;
app.post("/webhook", upload.single("image"), async (req, res) => {
    try {
        const imageFile = req?.file;
        const tags = req?.body?.tags;
        const text = req?.body?.text;
        const projectId = req?.body?.project_id;
        const folderPath = req?.body?.folder_path;
        if (!imageFile || !projectId || !folderPath) {
            res.status(400).json({ error: "Missing required fields" });
        }
        const result = await (0, upload_1.uploadToAutodesk)({
            imageFile,
            tags,
            text,
            projectId,
            folderPath,
        });
        res.json({ message: "Image uploaded successfully", result });
    }
    catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(PORT, () => { console.log(`Application listening on port ${PORT}`); });
//# sourceMappingURL=index.js.map