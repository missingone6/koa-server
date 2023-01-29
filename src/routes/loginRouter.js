import Router from '@koa/router';
import loginController from '../api/LoginController';
const router = new Router();

router.prefix('/api/login')
router.post('/login', loginController.login);
router.post('/register', loginController.register);

export default router;