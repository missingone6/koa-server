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


// 发送邮箱更新邮件
router.get('/email/username', UserController.sendmailAboutUsername);

export default router;