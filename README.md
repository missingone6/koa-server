# koa-server
基于个人喜好的一款基于发帖的pc端社交网站

前端：https://github.com/missingone6/weshare

后端：https://github.com/missingone6/koa-server

后端接口文档：https://www.showdoc.com.cn/weshare/9726772308648103

# 项目亮点
:rocket: 采用jwt+localStorage进行会话管理

# 项目启动前需要你手动配置的
本项目使用nodemailer进行邮件发送，使用前需要进入`src/config/MailConfig.js`文件，设置`auth.user` 和 `auth.pass`。
详情请参考https://nodemailer.com/about/

# 项目启动
npm run dev