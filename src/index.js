import koa from 'koa';
import path from 'path';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import statics from 'koa-static';
import compose from 'koa-compose'
import router from './routes/routes';
import jsonUtil from 'koa-json';
import { initRedis } from './config/RedisConfig';
const app = new koa();
// router.post('/post', async (ctx) => {
//   const { body } = ctx.request;
//   console.log(body)
//   console.log(ctx.request)
//   ctx.body = 'hello post'
// });


// router.get('/api', (ctx) => {
//   ctx.body = 'hello /api11111'
// });

initRedis();

const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../public')),
  cors(),
  jsonUtil(),
  helmet(),
])
app.use(middleware);

app.use(router())

app.listen(8000);