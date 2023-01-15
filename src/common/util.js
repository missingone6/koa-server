import { getValue } from "../config/RedisConfig"
import moment from 'moment';

// 检查验证码是否有效，是否正确
const checkCode = async (key, value) => {
  const redisValue = await getValue(key);
  if (redisValue !== null && redisValue.toLowerCase() === value.toLowerCase()) {
    return true;
  }
  return false;
}

// 返回当前时间
const createTime = () => {
  return moment();
}

export {
  checkCode,
  createTime,
}