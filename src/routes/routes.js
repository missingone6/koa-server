import combineRoutes from 'koa-combine-routers'

import publicController from './publicRouter.js';

export default combineRoutes(publicController)