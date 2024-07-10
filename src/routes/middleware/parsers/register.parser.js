const formidable = require('formidable');

const registerParser = (req, res, next) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const {username, email, password, confirmPassword} = fields;
        const {image} = files;

        req.body = {username, email, password, confirmPassword, image};
        next();
    });
};

module.exports = registerParser;