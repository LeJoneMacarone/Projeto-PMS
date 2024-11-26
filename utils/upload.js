const multer = require("multer");

// TODO: if needed, use this snippet to access the entire file's contents at req.file.buffer
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const upload = multer({ dest: "public/uploads/" });

module.exports = upload;
