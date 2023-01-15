import combineRoutes from 'koa-combine-routers'

import publicRouter from './publicRouter';
import loginRouter from './loginRouter';
import contentRouter from './contentRouter';

export default combineRoutes(
  publicRouter,
  loginRouter,
  contentRouter,
)