import mongoose from 'mongoose'
mongoose.Promise = global.Promise

import I18nSchema from './I18nSchema'

const I18nModel = mongoose.model('I18n', I18nSchema)

export default I18nModel
