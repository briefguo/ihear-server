### history 历史记录对象[使用详情参考](https://developer.mozilla.org/en-US/docs/Web/API/History)
  
  ```js

  // 使用时引用
  import history from 'lib/history'

  // 基本方法
  // 
  // 重定向到某个url
  history.go()
  // 跳转到state
  history.push()
  // 替换state
  history.replace()
  // 获取当前location
  history.getCurrentLocation()

  // 
  ```

### mapChildrenToView(children:array) 
  
  ```js
  // 将children映射成view
  import mapChildrenToView from 'lib/mapChildrenToView'

  let view = mapChildrenToView(this.props.children)

  // 
  ```

### fetchByOption
  
  ```js
  // 封装的异步action构建方法，基于fetchBy
  import fetchByOption from 'lib/fetchByOption'
  // 
  ```

### fetchBy 获取API
  
  ```js
  // 请求API
  import fetchBy from 'lib/fetchBy'

  fetchBy('API',opts)
    .then(response=>response.json())
    .then(json=>{
      log(json)
    })

  // 
  ```

### Session 会话对象
  
  ```js
  // 存取sessionStorage
  import Session from 'lib/Session'

  Session.get(dataKey)
  Session.set(dataKey,value)
  Session.remove(dataKey)
  Session.keys()
  // 
  ```

### Cookie 
  
  ```js
  // 存取document.cookie
  import Cookie from 'lib/Cookie'
  // 
  ```

### passwordEncode 密码加密
  
  ```js
  // 密码加密
  import passwordEncode from 'lib/passwordEncode'

  passwordEncode({ userName, passWord })
  // 
  ```

### Des 加密
  
  ```js
  // 获取当前环境是否加密
  import Des from 'lib/Des'

  // 加密
  Des.encrypt('string')

  // 解密
  Des.decrypt('string')

  // 
  ```

### encodeURL
  
  ```js
  // 加密URL
  import encodeURL from 'lib/encodeURL'

  encodeURL('url')
  // 
  ```

### decodeURL
  
  ```js
  // 解密URL
  import decodeURL from 'lib/decodeURL'

  decodeURL('url')
  // 
  ```

### runOnce 执行一次的方法
  
  ```js
  // 执行一次的方法
  import runOnce from 'lib/runOnce'
  // 
  ```

### convertListToObject 用对象数组列表转对象
  
  ```js
  // 将数组转成对象
  import convertListToObject from 'lib/convertListToObject'
  
  convertListToObject(terminalList, 'mmId:name')
  ```
