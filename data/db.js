//移除表
db.i18n_langs.drop()
db.i18n_modules.drop()
db.i18n_items.drop()

//清空表
db.i18n_langs.remove({})
db.i18n_modules.remove({})
db.i18n_items.remove({})

//创建表
db.createCollection('i18n_langs')
db.createCollection('i18n_moduels')
db.createCollection('i18n_items')

//添加数据到表i18n_langs
db.i18n_langs.insert({ code: 'zh', desc: 'zh-CN' })
db.i18n_langs.insert({ code: 'en', desc: 'en-US' })

//解析数据到表i18n_modules
db.i18ns.find().forEach(function(x){ var obj = {'name':x.key.split('.').shift(), 'project':x.project, 'createTime': (new Date()).getTime()}; db.i18n_modules.insert(obj)});
db.i18n_modules.aggregate([{$group:{_id:{project: '$project', name: '$name' }, count:{$sum:1}, dups:{$addToSet: '$_id'} }},{$match:{count:{$gt:1}}}]).forEach(function(x){x.dups.shift();db.i18n_modules.remove({_id:{$in:x.dups}})});

//解析数据到表i18n_items
db.i18n_modules.find().forEach(function(x){ db.i18ns.find({ project: x.project }).forEach(function(y){ if(y.key.indexOf(x.name+'.')!==-1){ var obj={key: y.key.split('.').pop(), value: y.value, lang:y.lang, module: x._id, createTime: (new Date()).getTime()}; db.i18n_items.insert(obj) } }) })