import koa from 'koa';
import path from 'path';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import statics from 'koa-static';
import compose from 'koa-compose'
import router from './routes/routes';
import jsonUtil from 'koa-json';
import JWT from 'koa-jwt';
import { initRedis } from './config/RedisConfig';
import config from './config';
import errorHandle from './common/errorHandle';
import koaMount from 'koa-mount';

const app = new koa();
const jwt = JWT({
  secret: config.JWT_SECRET,
}).unless({
  path: [
    /^\/public/,
    /^\/api\/login/,
    /^\/api\/public/,
    /^\/api\/email\/password$/,
    /^\/api\/users\/password$/,
  ]
});
initRedis();

const middleware = compose([
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  }),
  koaMount('/public', statics(path.join(__dirname, '../public'))),
  cors(),
  jsonUtil(),
  helmet(),
  errorHandle,
  jwt
])
app.use(middleware);

app.use(router())

app.listen(8000);