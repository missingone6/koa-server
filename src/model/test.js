import mongoose from '../config/DBHelpler';

const Schema = mongoose.Schema;


const TestSchema = new Schema({
  name: { type: String },
  age: { type: Number },
})

const TestModel = mongoose.model('students', TestSchema);

export default TestModel;

