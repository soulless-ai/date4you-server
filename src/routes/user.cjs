const express = require('express');
const router = express.Router();

const { UserController } = require('../controllers/User.cjs');
const authenticate = require('../middlewares/authenticate.cjs');

router.get('/user', new UserController().get);
router.post('/user', new UserController().post);
router.get('/user', authenticate, new UserController().get);
router.get('/user/remember', authenticate);

module.exports = router;