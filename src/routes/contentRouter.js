import Router from '@koa/router';
import ContentController from '../api/ContentController';
const router = new Router();

// router.prefix('/api/public')
router.get('/api/public/lists', ContentController.getPosts);
router.get('/api/public/links', ContentController.getLinks);
router.get('/api/public/tips', ContentController.getTips);
router.get('/api/public/topWeek', ContentController.getTopWeek);

// 图片上传
router.post('/api/users/photo', ContentController.upLoadPhoto);
// 发表新帖
router.post('/api/content/posts', ContentController.addPost);
// 查询文章详情（帖子详情）
router.get('/api/public/list', ContentController.getPostsDetail);
// 删除帖子
router.delete('/api/users/list', ContentController.deletePostsByUid);

export default router;