import multer from "multer"
import path from "path"
import { Request } from "express"

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    let folder = ""

    if (file.mimetype.startsWith("image/")) {
      folder = path.join(__dirname, "../../public/images/vehicles")
    } else if (file.mimetype.startsWith("video/")) {
      folder = path.join(__dirname, "../../public/videos")
    }

    cb(null, folder)
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]
  const allowedVideoTypes = [
    "video/mp4",
    "video/mkv",
    "video/webm",
    "video/avi",
  ]

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type"))
  }
}

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max file size 100MB
  },
  fileFilter,
})

export default upload
