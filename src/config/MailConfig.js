import nodemailer from 'nodemailer';
import config from '../config';
import qs from 'qs';

async function send(sendInfo) {

  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '1106225065@qq.com', // generated ethereal user
      pass: '' // generated ethereal password
    }
  })

  const { subject, email, expire, route, data } = sendInfo;
  const url = `${config.BASE_URL}${route}?` + qs.stringify(data)

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"认证邮件" <1106225065@qq.com>', // sender address
    to: email, // list of receivers
    subject: `WeShare-点我${subject}`,
    html: `
    <div style="height:200px;width:100%;border-radius: 20px;border: 1px solid #03a9f4;overflow: hidden;">
      <div style="box-sizing: border-box; height:50px;width:100%;background-color: #03a9f4;font-size: 42px;line-height: 50px;padding: 0 10px;">WeShare</div>
      <div style="box-sizing: border-box; height:150px; width:100%; padding: 10px;">
        如若发现不是您本人操作,请忽略！<br/>
        点此链接<a href=${url}>${url}</a>
        ,即可${subject},此链接将于${expire}过期。请谨慎操作!
      </div>
    </div>
    `
  })

  return `Message sent: %s, ${info.messageId}`
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


export default send
