在组件代码里引用

```js
import React from 'react';
import Svg from 'utils/Svg';

```


```html
默认状态
<Svg name="user"/>

使用行内style
<Svg style={{width:50,height:50}} name="user"/>

使用class
<Svg className={Styles.userSvg} name="user"/>

与描述文字一起使用
<div>
  <Svg name="user"/>
  <span>行内文字</span>
</div>
```
