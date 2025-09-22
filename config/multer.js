const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images/uploads");
	},
    filename: function (req, file, cb) {
        try {
            crypto.randomBytes(12, (err, bytes) => { 
                const fileName = bytes.toString('hex') + path.extname(file.originalname);
                cb(null,fileName);
            })
        } catch (err) {
            console.log(err)
        }
	},
});

const upload = multer({ storage: storage });

module.exports = upload