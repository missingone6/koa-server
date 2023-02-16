import mongoose from '../config/DBHelpler'
import { createTime } from '../common/util';

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  pid: { type: String, ref: 'posts' },
  uid: { type: String, ref: 'users' },
  cuid: { type: String, ref: 'users' },
  content: { type: String },
  created: { type: Date },
  likes: { type: Number, default: 0 },
  isShow: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isAdopt: { type: String, default: '0' }
})

CommentsSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

CommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

CommentsSchema.statics = {
  findByPid: function (id) {
    return this.find({ pid: id })
  },
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  getCommentsList: function ({ pid, page, limit, sort }) {
    return this.find({ pid })
      .sort({ [sort]: -1 })
      .populate({
        path: 'cuid',
        select: '_id name pic isVip',
        match: { isShow: { $eq: '0' } }
      }).populate({
        path: 'pid',
        select: '_id title isShow'
      }).skip(page * limit).limit(limit)
  },
  queryCount: function (id) {
    return this.find({ pid: id }).countDocuments()
  },
  // 查询用户评论列表
  getCommentsListByUid: function (cuid, page, limit) {
    return this.find({ cuid })
      .sort({ created: -1 })
      .select("created content")
      .populate({
        path: 'pid',
        select: '_id title'
      }).skip(page * limit).limit(limit);
  },
  queryCountByUid: function (cuid) {
    return this.find({ cuid }).countDocuments()
  },
}

const CommentsModel = mongoose.model('comments', CommentsSchema)

export default CommentsModel
