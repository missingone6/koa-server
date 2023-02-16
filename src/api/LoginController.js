import jwt from 'jsonwebtoken';
import moment from 'moment';
import { checkCode } from '../common/util';
import config from '../config';
import UsersModel from '../model/User';
import SignInModel from '../model/SignIn';
import { getHValue } from '../config/RedisConfig';

// 判断今日是否签到
export const addIsSignIn = async (userObj) => {
  const result = await SignInModel.findByUid(userObj._id);
  // 用户有签到记录
  if (result !== null) {
    userObj.lastSignIn = result.created;
    if (moment(result.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      userObj.isSignIn = true
    } else {
      userObj.isSignIn = false
    }
  } else {
    // 用户无签到记录
    userObj.isSignIn = false
  }
  return userObj
}

class LoginController {
  async login(ctx) {
    const { cid, code, username, password } = ctx.request.body;
    // 检查验证码是否有效，是否正确
    const isCodeCorrectAndValid = await checkCode(cid, code);
    if (isCodeCorrectAndValid) {
      // 检查账号是否正确
      const user = await UsersModel.findOne({
        username
      })
      if (user === null) {
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      } else {
        if (user.password === password) {
          const token = jwt.sign({
            username: username,
            _id: user._id,
          }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRESIN });
          const arr = ['password'];
          let data = {};
          Object.keys(user.toJSON()).forEach((key) => {
            if (!arr.includes(key)) {
              data[key] = user[key];
            }
          });
          data = await addIsSignIn(data)
          ctx.body = {
            code: 200,
            data,
            msg: '登录成功',
            token: token,
          }
        } else {
          ctx.body = {
            code: 404,
            msg: '用户名或者密码错误'
          }
        }
      }
    } else {
      ctx.body = {
        code: 401,
        msg: '图片验证码错误'
      }
    }
  }
  async register(ctx) {
    const { cid, code, username, password, name } = ctx.request.body;
    // 检查验证码是否有效，是否正确
    const isCodeCorrectAndValid = await checkCode(cid, code);
    if (isCodeCorrectAndValid) {
      // 检查username是否被注册
      const user = await UsersModel.findOne({
        username
      })
      if (user && (user.username !== undefined)) {
        ctx.body = {
          code: 404,
          msg: '用户名已注册过，请直接登录'
        }
      } else {
        // 检查name是否被注册
        const user2 = await UsersModel.findOne({
          name
        })
        if (user2 && (user2.name !== undefined)) {
          ctx.body = {
            code: 404,
            msg: '昵称与他人重复，请修改昵称'
          }
        } else {
          // 写入数据
          const data = new UsersModel({
            username,
            password,
            name
          });
          const result = await data.save();
          ctx.body = {
            code: 200,
            msg: '注册成功',
            data: result
          }
        }
      }
    } else {
      ctx.body = {
        code: 401,
        msg: '图片验证码错误'
      }
    }
  }
  // 忘记密码
  async password(ctx) {
    const { key } = ctx.request.body;
    if (key === undefined) {
      ctx.body = {
        code: 404,
        msg: '缺少参数'
      }
      return;
    }
    const obj = await getHValue(key);

    if (obj === null || Object.keys(obj).length === 0) {
      ctx.body = {
        code: 404,
        msg: '很抱歉，链接有误或者链接已过期'
      }
      return;
    }
    const { _id, password } = obj;
    await User.updateOne(
      { _id },
      { password }
    )
    ctx.body = {
      code: 200,
      msg: '更新密码成功'
    }
  }
}

export default new LoginController();