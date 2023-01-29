import Router from '@koa/router';
import UserController from '../api/UserController';
const router = new Router();

router.prefix('/api/users')
// 用户签到
router.patch('/fav', UserController.userSign);
router.get('/fav', UserController.getFavs);

export default router;