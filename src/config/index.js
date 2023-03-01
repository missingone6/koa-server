import path from 'path'
const MONGO_HOSTNAME = process.env.DB_HOST || 'localhost'
const MONGO_PORT = process.env.DB_PORT || '27017'
const DB_NAME = process.env.DB_NAME || 'test'

const DB_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`

const REDIS = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
}

const JWT_SECRET = 'galrkgeajlrgbpno';
// https://github.com/auth0/node-jsonwebtoken#token-expiration-exp-claim
const JWT_EXPIRESIN = '30m';

const JWT_REGISTER_SECRET = 'loginfsawtonikmegrgrr3gerago';
const JWT_REGISTER_EXPIRESIN = '30m';


// 前端
export const frontDevelopmentBaseUrl = 'http://localhost:3000';
export const frontProductionBaseUrl = '';
export const Front_BASE_URL = process.env.NODE_ENV === 'development' ? frontDevelopmentBaseUrl : frontProductionBaseUrl;

// 后端
const backDevelopmentBaseUrl = 'http://localhost:8000';
const backProductionBaseUrl = '';
const BACK_BASE_URL = process.env.NODE_ENV === 'development' ? backDevelopmentBaseUrl : backProductionBaseUrl;
const photoUploadPath = process.env.NODE_ENV === 'development'
  ? path.join(path.resolve(__dirname), '../../public/img')
  : path.join(path.resolve(__dirname), '../../public/img')
console.log('11', photoUploadPath)

// jwt白名单
const JWT_WHITE_LIST = [
  /^\/public/,
  /^\/api\/login/,
  /^\/api\/public/,
  /^\/api\/email\/password$/,
  /^\/api\/verify/,
]
export default {
  DB_NAME,
  MONGO_HOSTNAME,
  DB_URL,
  REDIS,
  JWT_SECRET,
  JWT_EXPIRESIN,
  Front_BASE_URL,
  photoUploadPath,
  JWT_REGISTER_SECRET,
  JWT_REGISTER_EXPIRESIN,
  JWT_WHITE_LIST,
}
