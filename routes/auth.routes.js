const router = require('express').Router();
const { register , login, whoami, updateProfile} = require('../controllers/auth.controllers');
const {restrict} = require('../middlewares/auth.middlewares');
const {image} = require('../libs/multer');

router.post('/register', register);
router.post('/login', login);
router.get('/whoami', restrict, whoami);
router.post('/updateprofile', image.single('image'), updateProfile);

module.exports = router;