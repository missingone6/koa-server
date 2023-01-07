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
          const token = jwt.sign({ _id: 'bar' }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRESIN });
          ctx.body = {
            code: 200,
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
}

export default new LoginController();