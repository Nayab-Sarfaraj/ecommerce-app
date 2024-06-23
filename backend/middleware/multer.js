const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("destination callback:", cb);
        if (typeof cb !== 'function') {
            throw new Error("Callback is not a function");
        }
        cb(null, "./public/temp");
        console.log(file)
    },
    filename: (req, file, cb) => {
        // console.log("filename callback:", cb);

        if (typeof cb !== 'function') {
            throw new Error("Callback is not a function");
        }

        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;
