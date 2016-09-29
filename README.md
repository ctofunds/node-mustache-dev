# Mustache Dev Server in Node.js

### 安装和启动

> 注意：需要 Node.js 6 及以上

1. `npm install` 安装依赖
1. `npm start` 启动一个 Node.js Server，输出 views 目录下的 mustache 模板+数据

### 路由规则

- 访问 `/` 或 `/index` 或 `/index.mustache` 会以 `views/index.mustache` 为模板输出内容
- 访问 `/home` 或 `home.mustache` 会以 `views/home.mustache` 为模板输出内容
- 如果同目录下存在同名的 `xxx.json` 或 `xxx.data.js`，会将其作为同名模板的数据文件
  - `xxx.data.js` 应该导出一个 Object: `module.exports = { /*...*/ }`

### 配置

- 默认端口 3002  
  `package.json` -> `"start": "micro"`

- 默认公共目录 views  
  `config.json` -> `"PUBLIC_FOLDER": "views"`

- 默认模板文件后缀 mustache  
  `config.json` -> `"TEMPLATE_EXT": "mustache"`
