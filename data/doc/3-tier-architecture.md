### 上层

根据路由配置导出的getRootRoute方法获取路由配置
根据领域组件根入口输出的rootReducer,来生成与之对应结构的Store树
然后结合react-router里的history对象生成同步syncHistory

根据reducers结构生成的状态工厂，用于生产状态，是一个状态机。
配有getState()、dispatch()、subscribe()等方法

例如：
getState()，
这是一个获取当前状态树上的所有状态，会返回一个有结构的state树
dispatch(Action)，
这是一个分发状态的方法，更改状态的唯一方法
subscribe(listener:function),
这是一个用于订阅或者说监听的方法，listener方法可以回调状态树
的状态，每一次action都会触发listener执行

根路由Router
  ```
  // 运用react-router-redux生成syncHistory
  const syncHistory = syncHistoryWithStore(history, store)

  <Router history={syncHistory} routes={getRootRoute()}/>

  ```

Provider作为最外层容器包裹着根路由 Router
  ```jsx
  <Provider store={store}>
    <Router history={syncHistory} routes={getRootRoute()}/>
  </Provider>
  ```

通过ReactDOM.render渲染到页面上的整个react应用


### 路由配置层

定义页面的URL及对应的容器组件，它对接的是容器层组件

路由配置层，根据URL配置具体对应的页面组件（也可能是容器组件）
比如一个应用市场，'https://xxx/market/'，这是一个模块
设置路由映射时，这一个URL应该是一个容器组件；
比如一个应用列表，'https://xxx/market/applist'，这是一
个模块里的页面设置路由映射时，这一个URL应该是一个页面组件；

  routes/


### 容器组件层

容器层是一层对模块、页面的包裹，它直接服务的是路由层

  containers/
  模块容器层 
  pages/
  页面容器层


### 领域组件层

组件层，它包含一系列的react、redux组件

  domain/
  业务组件层
  layouts/
  布局层

<!-- 定义一系列的actionCreators层，用于store树的dispacth() -->

### 公共库

底层包含了一系列的组件和公共方法，有些方法是必须使用的，有些是不必须的

  utils/
  工具层
  lib/
  公共层
