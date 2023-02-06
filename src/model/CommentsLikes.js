import mongoose from '../config/DBHelpler'
import { createTime } from '../common/util';

const Schema = mongoose.Schema

const CommentsLikesSchema = new Schema({
  cid: { type: String, ref: 'comments' },// 评论id
  uid: { type: String, ref: 'users' },// 点赞用户的ID
  created: { type: Date },
  isDelete: { type: String, default: '0' },
})

CommentsLikesSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

CommentsLikesSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

CommentsLikesSchema.statics = {
  findByCid: function (id) {
    return this.find({ cid: id })
  },
  getLikesByUid: function (id, page, limit) {
    return this.find({ uid: id })
      .populate({
        path: 'uid',
        select: '_id name pic'
      })
      .populate({
        path: 'cid',
        select: '_id content'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  }
}

const CommentsLikesModel = mongoose.model('comments_likes', CommentsLikesSchema)

export default CommentsLikesModel
