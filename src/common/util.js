import { getValue } from "../config/RedisConfig"

// 检查验证码是否有效，是否正确
const checkCode = async (key, value) => {
  const redisValue = await getValue(key);
  if (redisValue !== null && redisValue.toLowerCase() === value.toLowerCase()) {
    return true;
  }
  return false;
}

export {
  checkCode,
}