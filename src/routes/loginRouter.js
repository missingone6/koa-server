import Router from '@koa/router';
import loginController from '../api/LoginController';
const router = new Router();

router.prefix('/api/users')
router.post('/login', loginController.login);

export default router;