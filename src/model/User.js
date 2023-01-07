import mongoose from '../config/DBHelpler';

const Schema = mongoose.Schema;


const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
})

const UsersModel = mongoose.model('users', UserSchema);

export default UsersModel;

