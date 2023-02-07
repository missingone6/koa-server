import { createTime } from '../common/util';
import mongoose from '../config/DBHelpler';

const Schema = mongoose.Schema

const UserCollectSchema = new Schema({
  uid: { type: String },
  pid: { type: String },
  created: { type: Date }
})

UserCollectSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

UserCollectSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

UserCollectSchema.statics = {
  // 查询用户收藏的帖子
  getListsByUid: function (id, page, limit) {
    return this.find({
      uid: id,
      isDelete: "0"
    }).select("pid")
      .skip(limit * page)
      .limit(limit)
      .sort({ created: -1 })
  },

  // 查询用户收藏的帖子的总数
  getLengthOfListsByUid: function (id) {
    return this.find({ uid: id, isDelete: "0" }).countDocuments()
  }
}


const UserCollect = mongoose.model('user_collect', UserCollectSchema)

export default UserCollect
