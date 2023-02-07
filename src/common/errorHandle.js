
const errorHandle = (ctx, next) => {
  return next().catch((err) => {
    // Custom 401 handling if you don't want to expose koa-jwt errors to users
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      ctx.status = err.status || 500
      ctx.body = Object.assign({
        code: ctx.status,
        msg: err.message
      }, process.env.NODE_ENV === 'development'
        ? { stack: err.stack }
        : {}
      )
      console.log(err.stack);
    }
  });
};
export default errorHandle;