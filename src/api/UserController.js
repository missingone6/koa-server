import SignInModel from '../model/SignIn'
import { getJWTPayload } from '../common/util'
import User from '../model/User'
import moment from 'moment';

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
}

export default new UserController()
