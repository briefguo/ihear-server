import mongoose from 'mongoose'
mongoose.Promise = global.Promise

const I18nSchema = new mongoose.Schema({
  project: String,
  key: String,
  value: String,
  lang: String
})

const I18nLangSchema = new mongoose.Schema({
  code: String,
  desc: String
})

const I18nModuleSchema = new mongoose.Schema({
  name: String,
  project: String,
  createTime: Number
})

const I18nItemSchema = new mongoose.Schema({
  key: String,
  value: String,
  lang: String,
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'I18nModule' //外键
  },
  createTime: Number
})

export {
  I18nSchema,
  I18nLangSchema,
  I18nModuleSchema,
  I18nItemSchema
}
