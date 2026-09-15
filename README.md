---
title: Liquid Space
emoji: 🖐️
colorFrom: indigo
colorTo: purple
sdk: static
pinned: false
---

# LIQUID SPACE

基于 MediaPipe Hand Landmarker 的实时手势几何交互界面。

## 手势模式

| 模式 | 名称 | 触发手势 |
| --- | --- | --- |
| 01 | LINE | 食指 · 单线 |
| 02 | PLANE | 拇指 + 食指 |
| 03 | TRI-PRISM | 三指 · 三棱体 |
| 04 | QUAD-PRISM | 四指 · 四棱体 |
| 05 | PENTA-PRISM | 五指 · 五棱体 |

## 运行说明

- 页面需访问摄像头，浏览器会弹出授权提示，请点击「允许」
- 推荐 Chrome / Edge 桌面版
- 手部关键点模型 `models/hand_landmarker.task` 随仓库一起部署，不依赖外部模型源
- MediaPipe 运行时（WASM）从 jsDelivr CDN 动态加载

## 技术栈

纯静态 HTML / CSS / JavaScript，无构建步骤，无需后端服务。
