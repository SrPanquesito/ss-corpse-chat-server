const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images');
    },
    filename: (req, file, cb) => {
        const fileName = `${uuidv4()}-${file.originalname.replace(/\s/g, '').replace("\\" ,"/")}`;
        cb(null, fileName);
    }
});

const fileFilterImages = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const fileFilterGeneral = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/gzip' ||
        file.mimetype === 'audio/mpeg' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/mpeg' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/vnd.ms-powerpoint' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        file.mimetype === 'application/vnd.rar' ||
        file.mimetype === 'image/svg+xml' ||
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'video/webm' ||
        file.mimetype === 'audio/webm' ||
        file.mimetype === 'application/zip' ||
        file.mimetype === 'application/x-zip-compressed' ||
        file.mimetype === 'application/x-7z-compressed'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const multerDiskSingleImage = multer({
    storage: diskStorage,
    fileFilter: fileFilterImages
}).single('image')

const multerMemorySingleFile = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilterGeneral,
    limits: {
        fieldSize: 52428800 // 50MB
    }
}).single('file')

module.exports = {
    multerDiskSingleImage,
    multerMemorySingleFile
}