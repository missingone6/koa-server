import mongoose from '../config/DBHelpler';
import { createTime } from '../common/util';

const Schema = mongoose.Schema;


const PostSchema = new Schema({
  uid: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  created: { type: Date },
  catalog: { type: String },
  favs: { type: Number, default: 0 },
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: String, default: 100 },
  tags: {
    type: Array,
    default: [
      // {
      //   name: '',
      //   class: ''
      // }
    ]
  }
})

PostSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

PostSchema.statics = {
  /**
   * 查询文章列表数据
   * @param {Object} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} page 分页页数
   * @param {Number} limit 分页条数
   */
  getLists: function (options, sort, page, limit) {
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate({
        path: 'uid',
        select: 'name pic isVip'
      })
  },
  /**
   * 查询文章列表总数
   * @param {Object} options 筛选条件
   */
  getLengthOfLists: function (options) {
    return this.countDocuments(options)
  },
  /**
   * 获取本周热议
   */
  getTopWeek: function () {
    return this.find({
      created: {
        $gte: createTime().subtract(7, 'days')
      }
    }, {
      title: 1,
      answer: 1,
    }).sort({ answer: -1 })
      .limit(5)
  },
}
const PostModel = mongoose.model('posts', PostSchema);

export default PostModel;

