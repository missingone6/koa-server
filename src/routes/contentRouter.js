import Router from '@koa/router';
import ContentController from '../api/ContentController';
const router = new Router();

// router.prefix('/api/public')
router.get('/api/public/lists', ContentController.getPosts);
router.get('/api/public/links', ContentController.getLinks);
router.get('/api/public/tips', ContentController.getTips);
router.get('/api/public/topWeek', ContentController.getTopWeek);

export default router;