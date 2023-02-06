import CommentsModel from '../model/Comments';
import PostModel from '../model/Post';
import UserModel from '../model/User';
import CommentsLikesModel from '../model/CommentsLikes'
import { getJWTPayload } from '../common/util';


class CommentsController {
  // 获取评论列表
  async getComments(ctx) {
    let { page, pid, limit, sort } = ctx.request.query;
    if (page === undefined) {
      page = 0;
    }
    if (limit === undefined) {
      limit = 10;
    }
    let result = await CommentsModel.getCommentsList({
      pid,
      page,
      limit,
      sort: sort ? sort : 'likes'
    });

    // 如果用户登录了，还需要判断每条评论该用户是否已点赞
    if (typeof ctx.header.authorization !== 'undefined') {
      const obj = await getJWTPayload(ctx.header.authorization)
      if (typeof obj._id !== 'undefined') {
        result = result.map((item) => item.toJSON())
        for (let i = 0; i < result.length; i++) {
          let item = result[i];
          item.isLiked = '0';
          const newComment = await CommentsLikesModel.findOne({
            cid: item._id,
            uid: obj._id,
            isDelete: '0',
          })
          if (newComment && newComment.cid) {
            if (newComment.uid === obj._id) {
              item.isLiked = '1'
            }
          }
        }
      }
    }


    const total = await CommentsModel.queryCount(pid)
    ctx.body = {
      code: 200,
      total,
      data: result,
      msg: '查询成功'
    }
  }

  // 添加评论
  async addComments(ctx) {
    const { pid, content } = ctx.request.body
    const newComment = new CommentsModel({ pid, content })
    // 查询评论用户的ID
    const obj = await getJWTPayload(ctx.header.authorization)
    newComment.cuid = obj._id;
    // 查询帖子作者ID
    const newPost = await PostModel.findOne({ _id: pid })
    newComment.uid = newPost.uid
    // 保存
    const comment = await newComment.save()
    ctx.body = {
      code: 200,
      data: comment,
      msg: '评论成功'
    }
  }

  // 点赞评论
  async setCommentsLikes(ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const { cid } = ctx.request.body
    // 判断用户是否已经点赞
    const temp = await CommentsLikesModel.find({ cid, uid: obj._id, isDelete: '0' })
    // 已点赞则取消点赞
    if (temp.length > 0) {
      await CommentsLikesModel.updateOne({ cid, uid: obj._id, isDelete: '0' }, { $set: { isDelete: '1' } })
      await CommentsModel.updateOne({ _id: cid }, { $inc: { likes: -1 } })
      ctx.body = {
        code: 200,
        msg: '取消点赞成功',
        status: '0',
      }
    }
    // 已点赞则新增点赞
    else {
      // 新增一条点赞记录
      const newHands = new CommentsLikesModel({
        cid,
        uid: obj._id
      })
      await newHands.save()
      // 更新comments表中对应的记录的likes点赞数量
      await CommentsModel.updateOne({ _id: cid }, { $inc: { likes: 1 } })
      ctx.body = {
        code: 200,
        msg: '点赞成功',
        status: '1',
      }
    }

  }
}

export default new CommentsController()
