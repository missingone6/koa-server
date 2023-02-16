import { getValue } from "../config/RedisConfig";
import moment from 'moment';
import jwt from 'jsonwebtoken';
import config from '../config';

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

// 获取jwt中的Payload
const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

// 判断是不是对象
const isEmptyObject = (obj) => {
  if(Object.prototype.toString.call(obj) === '[object Object]'&&Object.keys(obj).length === 0){
    return true;
  }
  return false;
}

export {
  checkCode,
  createTime,
  getJWTPayload,
  isEmptyObject,
}