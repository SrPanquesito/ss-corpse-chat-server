const router = require('express').Router();
const {userRegister} = require('#controllers/auth.controller');
const {userRegisterValidator} = require('#validators/register.validator');

router.post('/register', userRegisterValidator, userRegister);

module.exports = router;