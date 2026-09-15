<a id="top"></a>

<p align="center">
  <a href="#zh">🇨🇳 中文</a> &nbsp;·&nbsp;
  <a href="#en">🇬🇧 English</a>
</p>

---

<a id="zh"></a>

# 🇨🇳 LIQUID SPACE

基于 MediaPipe Hand Landmarker 的实时手势几何交互界面。

👉 [在线演示](https://shawxyu.github.io/-Gesture-based-interaction/)
等待几秒看到手部识别光点
---

## ✋ 手势模式

| 模式 | 名称 | 触发手势 |
|------|------|----------|
| 01 | LINE | 食指 · 单线 |
| 02 | PLANE | 拇指 + 食指 |
| 03 | TRI-PRISM | 三指 · 三棱体 |
| 04 | QUAD-PRISM | 四指 · 四棱体 |
| 05 | PENTA-PRISM | 五指 · 五棱体 |

## 🛠 技术栈

- 纯静态 HTML / CSS / JavaScript
- MediaPipe Tasks Vision（`@mediapipe/tasks-vision`）
- WASM 运行时通过 jsDelivr CDN 加载
- 手部模型：`models/hand_landmarker.task`（随仓库部署，不依赖外部模型源）
- 无构建步骤，无后端服务

## 🚀 本地运行

浏览器要求摄像头必须在安全上下文运行，直接用 `file://` 打开 `index.html` 会失败。请起一个本地静态服务器：
bash
Python
python -m http.server 8000
或 Node
npx http-server -p 8000
然后浏览器打开：
http://localhost:8000
## ❓ 摄像头打不开 / CAMERA ERROR 怎么办？

- 使用 **Chrome / Edge 桌面版**
- 地址栏允许摄像头权限
- 不要在 `file://` 下运行
- 检查系统设置里是否禁用了浏览器摄像头
- 其他程序（Zoom / 微信 / OBS）占用了摄像头，先关掉
- 公司/学校网络或扩展插件也可能拦截摄像头

---

<a id="en"></a>

# 🇬🇧 LIQUID SPACE

Real-time hand-geometry interaction interface powered by MediaPipe Hand Landmarker.

👉 [Live Demo](https://shawxyu.github.io/-Gesture-based-interaction/)

---

## ✋ Gesture Modes

| Mode | Name | Trigger |
|------|------|---------|
| 01 | LINE | Index finger only |
| 02 | PLANE | Thumb + Index |
| 03 | TRI-PRISM | Three fingers |
| 04 | QUAD-PRISM | Four fingers |
| 05 | PENTA-PRISM | Five fingers |

## 🛠 Tech Stack

- Static HTML / CSS / JavaScript
- MediaPipe Tasks Vision
- WASM runtime loaded from jsDelivr CDN
- Model: `models/hand_landmarker.task`
- No build step, no backend

## 🚀 Run Locally

Camera access requires a secure context. `file://` usually fails.
bash
python -m http.server 8000

Open:
http://localhost:8000
## ❓ Camera / CAMERA ERROR

- Use desktop Chrome or Edge
- Allow camera permission
- Do not open via `file://`
- Close Zoom / OBS / WeChat that may lock the camera
- Check OS privacy settings

---

## 📁 项目结构 / Project Structure
.
├── index.html
├── script1.js
├── style.css
├── README.md
├── models/
│ └── hand_landmarker.task
└── package.json
## 🌐 部署 / Deployment

项目通过 GitHub Pages 部署：

1. 推送到 `main` 分支
2. Settings → Pages → Branch: `main` / Folder: `/root`
3. 访问 `https://<username>.github.io/<repo>/`

## 📄 License

For learning / demo use.

[🔝 回到顶部 / Back to top](#top)
























