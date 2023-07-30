const router = require('express').Router();
const {
  getUserById, updateUserById, login, createUser,
} = require('../controllers/users');

router.get('/me', getUserById);
router.patch('/me', updateUserById);
module.exports = router;
