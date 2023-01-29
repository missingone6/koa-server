import mongoose from '../config/DBHelpler'
import { createTime } from '../common/util';


const Schema = mongoose.Schema

const SignInSchema = new Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  favs: { type: Number }
})

SignInSchema.pre('save', function (next) {
  this.created = createTime();
  next();
})

SignInSchema.statics = {
  findByUid: function (uid) {
    return this.find({ uid: uid })
      .sort({ created: -1 })
      .findOne();
  },
  getLatestSignIn: function () {
    return this.find({})
      .sort({ created: -1 })
      .limit(10)
      .populate({
        path: 'uid',
        select: '_id name pic'
      })
  },
  getTodaySignIn: function () {
    return this.find({
      created: { $gte: createTime().format('YYYY-MM-DD 00:00:00') }
    })
      .sort({ favs: -1 })
      .limit(10)
      .populate({
        path: 'uid',
        select: '_id name pic'
      })
  },
}

const SignInModel = mongoose.model('sign_record', SignInSchema)

export default SignInModel;
