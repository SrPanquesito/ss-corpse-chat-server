const router = require('express').Router();
const {userRegister} = require('#controllers/auth.controller');

router.post('/register', userRegister);

module.exports = router;