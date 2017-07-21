import mongoose from 'mongoose'
mongoose.Promise = global.Promise

const I18nSchema = new mongoose.Schema({
  project: String,
  key: String,
  value: String,
  lang: String
})

export default I18nSchema
