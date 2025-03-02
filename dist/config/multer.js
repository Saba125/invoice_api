"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Explicitly type the storage variable
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Set the folder where files will be stored
        cb(null, path_1.default.join(__dirname, "../../public/movie-images"));
    },
    filename: (req, file, cb) => {
        // Use a timestamp with the original file extension for the filename
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
// Define a file filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type"));
    }
};
// Configure multer
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Max file size 5MB
    },
    fileFilter,
});
exports.default = upload;
