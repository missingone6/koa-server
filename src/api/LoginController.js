import jwt from 'jsonwebtoken';
import { checkCode } from '../common/util';
import config from '../config';
import UsersModel from '../model/User';


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
          const token = jwt.sign({ username: username }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRESIN });
          ctx.body = {
            code: 200,
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
}

export default new LoginController();