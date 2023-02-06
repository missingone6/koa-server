import Router from '@koa/router';
import CommentsController from '../api/CommentsController';
const router = new Router();

router.prefix('/api');
// 评论列表接口
router.get('/public/comments', CommentsController.getComments);
// 添加评论接口
router.post('/comments', CommentsController.addComments);
// 点赞评论
router.post('/comments/voters', CommentsController.setCommentsLikes);

export default router;