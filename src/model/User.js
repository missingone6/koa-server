import { createTime } from '../common/util';
import mongoose from '../config/DBHelpler';

const Schema = mongoose.Schema;


const UserSchema = new Schema({
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String },
  created: { type: Date },
  updated: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/img/header.webp' },
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' },
  status: { type: String, default: '0' },
  regmark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 },
  openid: { type: String, default: '' },
  unionid: { type: String, default: '' }
})

UserSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

UserSchema.pre('update', function (next) {
  this.created = createTime();
  next()
})

// 防止username相同的情况
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Mongoose has a duplicate key.'))
  } else {
    next(error)
  }
})


UserSchema.statics = {
  /**
   * 根据id获取用户信息
   * @param {String} id 用户id
   */
  findByID: function (id) {
    return this.findOne(
      { _id: id },
      {
        password: 0,
        username: 0,
        mobile: 0
      }// 不返回敏感信息
    )
  },
}
const UsersModel = mongoose.model('users', UserSchema);

export default UsersModel;

