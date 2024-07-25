const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)){
	fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, `${uuidv4()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

module.exports = {
	upload
};