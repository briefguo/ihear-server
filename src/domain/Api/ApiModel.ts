import mongoose from 'mongoose' // 引用mongoose模块
mongoose.Promise = global.Promise

import ApiSchema from './ApiSchema'

const ApiModel = mongoose.model('Api', ApiSchema)

export default ApiModel
