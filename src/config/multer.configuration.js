const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images');
    },
    filename: (req, file, cb) => {
        const fileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '').replace("\\" ,"/")}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({storage, fileFilter}).single('image')