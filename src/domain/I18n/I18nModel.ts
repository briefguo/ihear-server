import mongoose from 'mongoose'
mongoose.Promise = global.Promise

import {
  I18nSchema,
  I18nLangSchema,
  I18nModuleSchema,
  I18nItemSchema
} from './I18nSchema'


//lwf注：由于mongoose会对名称含下划线(_)的表名做处理，造成表名不一致，查询错误，所以这里手动指明表名
const I18nModel = mongoose.model('I18n', I18nSchema)
const I18nLangModel = mongoose.model('i18nLang', I18nLangSchema, 'i18n_langs')
const I18nModuleModel = mongoose.model('I18nModule', I18nModuleSchema, 'i18n_modules')
const I18nItemModel = mongoose.model('I18nItem', I18nItemSchema, 'i18n_items')

export {
  I18nModel,
  I18nLangModel,
  I18nModuleModel,
  I18nItemModel
}
