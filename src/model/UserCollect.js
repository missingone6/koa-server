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


const UserCollect = mongoose.model('user_collect', UserCollectSchema)

export default UserCollect
