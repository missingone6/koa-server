import mongoose from '../config/DBHelpler';
import { createTime } from '../common/util';

const Schema = mongoose.Schema;


const LinkSchema = new Schema({
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  created: { type: Date },
  sort: { type: String, default: '' }
})

LinkSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

const LinkModel = mongoose.model('links', LinkSchema);

export default LinkModel;

