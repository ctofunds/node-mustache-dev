# node-mustache-dev

Mustache Dev Server in Node.js

### 安装

> 注意：需要 Node.js 6 及以上

1. `npm install` 安装依赖
1. `npm start` 启动一个 Node.js Server，输出 views 目录下的 mustache 模板+数据

### 配置

- 默认端口 3002  
  `package.json` -> `"start": "micro"`

- 默认公共目录 views  
  `config.json` -> `"PUBLIC_FOLDER": "views"`

- 默认模板文件后缀 mustache  
  `config.json` -> `"TEMPLATE_EXT": "mustache"`
