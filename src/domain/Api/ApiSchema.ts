import mongoose from 'mongoose' //引用mongoose模块
mongoose.Promise = global.Promise

var ApiSchema = new mongoose.Schema({
  name: String, //定义一个属性name，类型为String
  project: { type: String, default: 'mgt' },
  pathArray: Array,
  required: Array,
  requestParamsType: Array,
  requestParams: Array,
  responseType: String,
  response: Object,
})

export default ApiSchema
