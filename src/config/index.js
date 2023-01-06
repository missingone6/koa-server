const MONGO_HOSTNAME = process.env.DB_HOST || 'localhost'
const MONGO_PORT = process.env.DB_PORT || '27017'
const DB_NAME = process.env.DB_NAME || 'test'

const DB_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${DB_NAME}`

const REDIS = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
}

export default {
  DB_NAME,
  MONGO_HOSTNAME,
  DB_URL,
  REDIS,
}
