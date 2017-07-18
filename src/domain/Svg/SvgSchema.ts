import mongoose from 'mongoose' //引用mongoose模块
mongoose.Promise = global.Promise
var SvgSchema = new mongoose.Schema({
  id: String,
  viewbox: Array,
  title: Array,
  modulePaths: Array,
})

export default SvgSchema
