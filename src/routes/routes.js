import combineRoutes from 'koa-combine-routers'

import publicRouter from './publicRouter';
import loginRouter from './loginRouter';
import contentRouter from './contentRouter';
import UserController from './userRouter';
import commentsRouter from './commentsRouter';

export default combineRoutes(
  publicRouter,
  loginRouter,
  contentRouter,
  UserController,
  commentsRouter,
)