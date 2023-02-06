import LinkModel from '../model/Link';
import TipModel from '../model/Tip';
import PostModel from '../model/Post';
import UserModel from '../model/User';
import mkdir from 'make-dir';
import { v4 as uuidv4 } from 'uuid'
import config from '../config';
import fs from 'fs';
import { getJWTPayload } from '../common/util'

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

  // 查询文章详情（帖子详情）
  async getPostsDetail(ctx) {
    const { pid } = ctx.request.query;
    if (!pid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return;
    }
    const post = await PostModel.findPostByPid(pid)

    if (post) {
      ctx.body = {
        code: 200,
        data: post,
        msg: '查询文章详情成功'
      }
      return
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

  // 图片上传
  async upLoadPhoto(ctx) {
    const { photo } = ctx.request.files
    // 文件后缀
    const ext = photo.name.split('.')[1]
    // 存储的位置
    const dir = config.photoUploadPath
    // 判断路径是否存在，如果不存在则创建
    await mkdir(dir)

    // 存储文件到指定的路径
    // 给文件一个唯一的名称
    const name = uuidv4()
    const destPath = `${dir}/${name}.${ext}`
    const reader = fs.createReadStream(photo.path)
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/public/img/${name}.${ext}`
    reader.pipe(upStream)

    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }

  // 发表新帖
  async addPost(ctx) {
    const { title, favs, content, catalog } = ctx.request.body;

    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await UserModel.findByID({ _id: obj._id })
    if (user)
      // 判断用户的所剩积分数是否足够
      // 积分数不足,则直接返回
      if (user.favs < favs) {
        ctx.body = {
          code: 501,
          msg: '很抱歉,用户积分不足'
        }
        return
      }
    // 积分数足够,则1.创建新的post,2.减少积分
    await UserModel.updateOne({ _id: obj._id }, { $inc: { favs: -favs } })
    const newPost = new PostModel({
      title, favs, content, catalog
    })
    newPost.uid = obj._id
    const result = await newPost.save()
    ctx.body = {
      code: 200,
      msg: '帖子发表成功',
      data: result
    }
  }
}

export default new ContentController();