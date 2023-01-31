import SignInModel from '../model/SignIn'
import { checkCode, getJWTPayload } from '../common/util'
import User from '../model/User'
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'
import { getHValue, getValue, setValue } from '../config/RedisConfig';
import send from '../config/MailConfig';

class UserController {
  // 用户签到接口
  async userSign(ctx) {
    // 取用户的ID
    const obj = await getJWTPayload(ctx.header.authorization)

    // 查询用户上一次签到记录
    const record = await SignInModel.findByUid(obj._id)
    const user = await User.findByID(obj._id)
    let newRecord = {}
    let result = ''
    // 有历史的签到数据
    if (record !== null) {
      // 用户今天已经签到过了
      if (
        moment(record.created).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
      ) {
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          lastSignIn: record.created,
          msg: '用户已经签到'
        }
        return
      } else {
        // 用户今天还没签到，判断是否连续签到
        let count = user.count
        let favs = 0
        // 用户连续签到了
        // 第n+1天签到的时候，需要与第n的天created比较
        if (
          moment(record.created).format('YYYY-MM-DD') ===
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
        ) {
          // 连续签到的积分获得逻辑
          count += 1
          if (count < 5) {
            favs = 5
          } else if (count < 15) {
            favs = 10
          } else {
            favs = 15
          }
          await User.updateOne(
            { _id: obj._id },
            {
              $inc: { favs, count: 1 }
            }
          )
          result = {
            favs: user.favs + favs,
            count: user.count + 1
          }
        } else {
          // 用户没连续签到
          favs = 5
          await User.updateOne(
            { _id: obj._id },
            {
              $set: { count: 1 },
              $inc: { favs: favs }
            }
          )
          result = {
            favs: user.favs + favs,
            count: 1
          }
        }
        // 更新签到记录
        newRecord = new SignInModel({
          uid: obj._id,
          favs,
        })
        await newRecord.save()
      }
    } else {
      // 无历史的签到数据，第一次签到
      // 保存用户的签到数据，签到记数 + 积分数据
      await User.updateOne(
        {
          _id: obj._id
        },
        {
          $set: { count: 1 },
          $inc: { favs: 5 }
        }
      )
      // 保存用户的签到记录
      newRecord = new SignInModel({
        uid: obj._id,
        favs: 5
      })
      await newRecord.save()
      result = {
        favs: user.favs + 5,
        count: 1
      }
    }
    ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result,
      lastSignIn: newRecord.created
    }
  }

  // 查询积分
  async getFavs(ctx) {

    const { sort } = ctx.request.query;
    let result;
    if (sort === 'latest') {
      result = await SignInModel.getLatestSignIn()
    } else {
      result = await SignInModel.getTodaySignIn()
    }

    ctx.body = {
      code: 200,
      data: result,
      msg: '查询积分成功',
    }
  }

  // 发送邮箱更新邮件
  async sendmailAboutUsername(ctx) {
    const body = ctx.request.body

    if (body.username === undefined) {
      ctx.body = {
        code: 404,
        msg: '缺少username参数'
      }
      return;
    }
    const obj = await getJWTPayload(ctx.header.authorization)
    // 判断用户是否修改了邮箱
    const user = await User.findOne({ _id: obj._id })
    if (body.username && body.username !== user.username) {
      // 用户修改了邮箱, 发送reset邮件
      // 判断用户的新邮箱是否已经有人注册
      const tempUser = await User.findOne({ username: body.username })
      if (tempUser && tempUser.password) {
        ctx.body = {
          code: 501,
          msg: '邮箱已被人注册'
        }
      } else {
        const key = uuidv4();
        await setValue(key, obj._id, 10 * 60);
        await send({
          subject: '重置邮箱',
          data: {
            key: key,
            username: body.username
          },
          route: '/confirm/username',
          expire: moment()
            .add(10, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
          email: user.username,
          name: user.name
        })
        ctx.body = {
          code: 200,
          msg: `账号修改需要邮件确认,邮件已发至${user.username}，请查收邮件！`
        }
      }
    } else {
      ctx.body = {
        code: 501,
        msg: '新邮箱不能和原来的邮箱一致'
      }
    }
  }

  // 邮箱更新
  async usernameUpdate(ctx) {
    const body = ctx.request.body;
    if (body.key === undefined || body.username === undefined) {
      ctx.body = {
        code: 404,
        msg: '缺少参数'
      }
      return;
    }
    const _id = await getValue(body.key)
    if (_id === null) {
      ctx.body = {
        code: 404,
        msg: '很抱歉，链接有误或者链接已过期'
      }
      return;
    }
    await User.updateOne(
      { _id },
      {
        username: body.username
      }
    )
    ctx.body = {
      code: 200,
      msg: '更新用户名成功'
    }
  }

  // 密码更新
  async passwordUpdate(ctx) {
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

  // 发送找回密码邮件
  async sendmailAboutPassword(ctx) {
    const { newPassword, cid, code, username } = ctx.request.body
    // 检查验证码是否有效，是否正确
    const isCodeCorrectAndValid = await checkCode(cid, code);
    if (!isCodeCorrectAndValid) {
      ctx.body = {
        code: 401,
        msg: '图片验证码错误'
      }
      return;
    }

    const user = await User.findOne({ username })
    if (user === null) {
      ctx.body = {
        code: 404,
        msg: '邮箱还未注册，请先去注册'
      }
      return;
    }
    // 判断用户是否修改了密码
    if (newPassword && newPassword === user.username) {
      ctx.body = {
        code: 501,
        msg: '新密码不能和原来的密码一致'
      }
      return;
    }
    // 用户修改了密码, 发送reset邮件
    const key = uuidv4();
    await setValue(key, {
      _id: user._id,
      password: newPassword
    }, 10 * 60);
    await send({
      subject: '重置密码',
      data: {
        key,
        username,
      },
      route: '/confirm/password',
      expire: moment()
        .add(10, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      email: user.username,
      name: user.name
    })
    ctx.body = {
      code: 200,
      msg: `密码修改需要邮件确认,邮件已发至${user.username}，请查收邮件！`
    }
  }



}

export default new UserController()
