import mongoose from '../config/DBHelpler';
import { createTime } from '../common/util';

const Schema = mongoose.Schema;


const TipSchema = new Schema({
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  created: { type: Date },
  sort: { type: String, default: '' }
})

TipSchema.pre('save', function (next) {
  this.created = createTime();
  next()
})

const TipModel = mongoose.model('tips', TipSchema);

export default TipModel;

