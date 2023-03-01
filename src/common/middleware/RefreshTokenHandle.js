import jwt from 'jsonwebtoken';
import config from '../../config';

/**
 * 判断token是否过期。
 * （过期则判断是否在10分钟之内，
 * 如果在10分钟之内则给用户返回新的token）
 */
const RefreshTokenHandle = async (ctx, next) => {
  //获取生成token时的过期时间,判断是否在允许过期延迟时间范围内，
  // 如果是则重新生成token返回，否则报错
  const payload = {};
  const oldToken = ctx.header.authorization.split(' ')[1];
  //防止token不传或token前缀不符，直接返回让后面的koa-jwt去处理
  if (!ctx.header.authorization || ctx.header.authorization.indexOf('Bearer ') == -1) {
    await next();
  } else {
    try {
      payload = jwt.verify(oldToken, config.JWT_SECRET);
    } catch (err) {
      console.log(err.message, new Date(err.expiredAt).getTime());
      throw err;
    }
    if (payload && payload.exp) {
      var allowTime = parseInt(payload.exp) - parseInt(new Date().getTime() / 1000);
      console.log(allowTime);
      if (allowTime <= 60 * 10) {
        const { username, _id } = payload;
        await next();
        // 解决重复生成jwt的问题，只记录过去5秒内原始jwt刷新生成新jwt的数据
        // 几秒内如果发现同样的jwt再次请求刷新，就返回相同的新的jwt数据。
        let newToken = await getValue(oldToken)
        if (newToken === null) {
          newToken = jwt.sign({
            username,
            _id,
          }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRESIN
          });
          await setValue(oldToken, newToken, 5);
        }
        ctx.body.token = newToken;
      } else {
        await next();
      }
    }
  }
}
export default RefreshTokenHandle;
