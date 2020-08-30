## vue-iview-admin使用

### 1. 下载基础包

```
https://github.com/iview/iview-admin.git
```

### 2. 升级 4.x 指南

需要将 npm 包 `iview` 以及任何引用 iview 的地方都替换为 `view-design`，一般来说，有以下几处：

`package.json` 中，添加新包 `view-design`： 

```json
"dependencies": {
    "view-design": "^4.0.0"
}
```

添加完后需要执行 `npm install`，或者直接通过 `npm install view-design --save` 安装新包。

Webpack 入口 `main.js` 中，把原先引用的 iview 替换为 `view-design`： 

```javascript
import Vue from 'vue';
import ViewUI from 'view-design';

// import style
import 'view-design/dist/styles/iview.css';
// iview-admin中 在index.css中引入
// @import '~view-design/dist/styles/iview.css';

Vue.use(ViewUI);
```

同理，如果是按需引用，任何使用 `from 'iview'` 的都要替换为 `from 'view-design'`。

如果您在项目中使用了 iview 内置的工具函数文件，比如 `iview/src/utils/assist.js` 等，都要进行包名替换来使用最新版本，如未使用，请忽略： 

```javascript
// e.g.
import { findComponentDownload } from 'view-design/src/utils/assist';
import { on, off } from 'view-design/src/utils/dom';
```

建议您可以在项目中全局搜索关键词 `from 'iview` 来查找所有引用旧 iview 的地方，方便替换为新的 npm 包 `view-design`。



