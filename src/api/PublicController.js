import svgCaptcha from 'svg-captcha';
import { setValue } from '../config/RedisConfig';


class PublicController {
  constructor() { }
  async getCaptcha(ctx) {
    const { captchaId } = ctx.request.query;
    const captcha = svgCaptcha.create({
      noise: Math.floor(Math.random() * 4) + 1,// 1-4
      width: 150,
      height: 50,
      size: 4
    });
    setValue(captchaId, captcha.text, 5 * 60);
    ctx.body = {
      code: 200,
      data: captcha.data
    }
  }
}

export default new PublicController();