import Router from '@koa/router';
import publicController from '../api/PublicController';
const router = new Router();

router.prefix('/api/public')
router.get('/getCaptcha', publicController.getCaptcha);

export default router;