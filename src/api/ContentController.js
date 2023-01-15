import LinkModel from '../model/Link';
import TipModel from '../model/Tip';
import PostModel from '../model/Post';


class ContentController {

  // 查询文章列表
  async getPosts(ctx) {
    
    const { isTop, page, limit, catalog, sort, status, title, isEnd } = ctx.request.query;
    const options = {}

    if (title) {
      options.title = { $regex: title }
    }
    if (catalog && catalog !== 'index') {
      options.catalog = { $in: catalog }
    }
    if (isTop) {
      options.isTop = isTop
    }
    if (isEnd) {
      options.isEnd = isEnd
    }
    if (status) {
      options.status = status
    }
    if (typeof tag !== 'undefined' && tag !== '') {
      options.tags = { $elemMatch: { name: tag } }
    }
    const result = await PostModel.getLists(
      options,
      sort ? sort : 'created',
      page ? Number(page) : 0,
      limit ? Number(limit) : 30,
    )
    const total = await PostModel.getLengthOfLists(options)

    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '查询文章列表成功',
    }
  }

  // 查询友情链接
  async getLinks(ctx) {
    const result = await LinkModel.find()
    ctx.body = {
      code: 200,
      data: result,
    }
  }

  // 查询温馨提醒
  async getTips(ctx) {
    const result = await TipModel.find()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 查询本周热议
  async getTopWeek(ctx) {
    const result = await PostModel.getTopWeek()
    ctx.body = {
      code: 200,
      data: result,
      total: result.length,
      msg: '查询本周热议成功',
    }
  }


}

export default new ContentController();