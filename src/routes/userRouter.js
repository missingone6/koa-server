import Router from '@koa/router';
import UserController from '../api/UserController';
const router = new Router();

router.prefix('/api')
// 用户签到
router.patch('/users/fav', UserController.userSign);
// 用户积分查询
router.get('/users/fav', UserController.getFavs);
// 用户邮箱更新
router.patch('/users/username', UserController.usernameUpdate);
// 用户密码更新
router.patch('/users/password', UserController.passwordUpdate);

// 发送邮箱更新邮件
router.post('/email/username', UserController.sendmailAboutUsername);
// 发送找回密码邮件
router.post('/email/password', UserController.sendmailAboutPassword);

export default router;