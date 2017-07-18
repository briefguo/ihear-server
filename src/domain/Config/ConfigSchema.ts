import mongoose from 'mongoose' //引用mongoose模块
mongoose.Promise = global.Promise
var ConfigSchema = new mongoose.Schema({
  md5Key: Array,
  DES: Array,
  server: Array,
  modulePaths: Array,
})

export default ConfigSchema
