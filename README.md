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



前端使用react+react-router-dom实现单页面，使用axios请求后端数据，并使用react-redux管理用户基本信息。

服务端采用koa+mongodb+redis实现。

基于React+React-reudx和node.js的前后端分离的pc端项目。项目前端基于

该项目是一个基于发贴的移动端社交网站。前端使用 vue-cli 作为 Vue 框架开发脚手架，并使用 Vuex 管理数据，加深了我对 Vue 生命周期的理解。同时采用 flex 配合 rem 适配了主流移动端，利用 webSocket 实现了系统推送功能。服务端使用 Nodejs、Express、MySQL 实现，通过 session、 cookie 机制判别用户身份，实现了登录注册、发帖、评论回复、点赞等功能。在填充数据的过程中熟悉了 与服务端的交互。这个项目使我对组件化开发和 Vue 框架有了一定的了解。

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