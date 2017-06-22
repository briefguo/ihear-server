import mongoose from 'mongoose' //引用mongoose模块
mongoose.Promise = global.Promise

import ConfigSchema from './ConfigSchema'

const ConfigModel = mongoose.model('Config', ConfigSchema)

export default ConfigModel
