const { users_controller } = require('../controllers');
const authorize_middleware = require('../middlewares/auth')
const router = require('express').Router();

router.post('/', users_controller.create_user);
router.post('/login', users_controller.login_user);
router.patch('/:user_id', authorize_middleware, users_controller.update_user_status);

module.exports = router;