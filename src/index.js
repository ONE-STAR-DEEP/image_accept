import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());


const uploadPath = "/var/www/uploads";

// Create folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname || ".webp");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  },
});

// POST API
app.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      return res.json({
        success: true,
        filename: req.file.filename,
        path: req.file.path,
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

router.post("/officeig", async (req, res) => {
  try {

    // Header verification
    const deviceKey = req.headers["device-key"];

    console.log("Device Key:", deviceKey);

    // Webhook payload
    const data = req.body;

    console.log("Received Webhook Data:");
    console.dir(data, { depth: null });

    // Check if payload is array
    if (Array.isArray(data)) {

      for (const attendance of data) {

        console.log("---------------");
        console.log("Employee:", attendance.name);
        console.log("Enroll ID:", attendance.enrollid);
        console.log("Time:", attendance.time);
        console.log("Mode:", attendance.mode);
        console.log("Device:", attendance.device_no);

      }

    }

    return res.status(200).json({
      success: true,
      message: "Webhook received"
    });

  } catch (error) {

    console.error("OfficeIG Webhook Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to IMAGE API"
  });
});

app.use("/uploads", express.static("/var/www/uploads"));

app.listen(8000, () => {
  console.log("Server running on port 8000");
});