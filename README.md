# koa-server
本项目是WeShare项目的后端，WeShare是一款 pc端的 基于个人喜好的发帖社交网站 。

前端：https://github.com/missingone6/weshare

后端：https://github.com/missingone6/koa-server

后端接口文档：https://www.showdoc.com.cn/weshare/9726772308648103



# 项目介绍

WeShare是一款pc端的发帖分享论坛。

:rocket: 登录模块实现了用户注册、登录，忘记密码（通过邮箱验证找回）、修改密码功能

:rocket: 帖子模块实现了发帖、删帖、收藏帖子、评论回复、评论点赞功能

:rocket: 用户模块实现了修改用户资料、展示用户资料、每日签到获取积分功能

...



# 项目亮点
:rocket: 采用jwt+localStorage进行会话管理，实现了用户在期限内免登录的效果

:rocket: 利用axios请求拦截器解决异步请求竞态问题

:rocket: 对首页帖子展示实现滚动加载

########



项目简介：一款发帖分享的论坛，基于 React+React-Redux 和  Nodejs 的前后端分离的pc端项目。

实现功能：登录模块实现了用户注册、登录，忘记密码（通过邮箱验证找回）、修改密码功能。帖子模块实现了发帖、删帖、收藏帖子、评论回复、评论点赞功能。用户模块实现了修改用户资料、展示用户资料、每日签到获取积分功能。

1采用jwt+localStorage进行会话管理，实现了用户在期限内免登录的效果。

2.使用路由守卫进行权限管理。比如用户个人页面需登录后才能访问，在未登录的情况下访问会跳转至登录页面。

3.利用axios请求拦截器解决异步请求竞态问题

4.根据不同使用场景，对长列表进行优化。首页帖子展示，使用了滚动懒加载的技术。用户收藏的帖子展示，使用了分页技术。



# 项目启动前需要你手动配置的
本项目使用nodemailer进行邮件发送，使用前需要进入`src/config/MailConfig.js`文件，设置`auth.user` 和 `auth.pass`。
详情请参考https://nodemailer.com/about/

# 项目启动
npm run dev
