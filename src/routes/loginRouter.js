import Router from '@koa/router';
import loginController from '../api/LoginController';
const router = new Router();

router.prefix('/api')
router.post('/login/login', loginController.login);
router.post('/login/register', loginController.register);
// 忘记密码
router.patch('/login/password', loginController.password);
// 用户验证注册接口
router.post('/verify/register', loginController.verifyRegister);

export default router;