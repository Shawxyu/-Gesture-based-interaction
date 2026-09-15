# LIQUID SPACE

> 基于 MediaPipe Hand Landmarker 的实时手势几何交互界面  
> Real-time hand-geometry interaction interface powered by MediaPipe Hand Landmarker

[Live Demo / 在线演示](https://shawxyu.github.io/-Gesture-based-interaction/)

---

## 中文说明

LIQUID SPACE 是一个纯前端网页项目：用摄像头捕捉手部 21 个关键点，根据伸出的手指数量/组合，实时生成线、面、三棱体、四棱体、五棱体等几何形态。

### 手势模式 / Gesture Modes

| 模式 | 名称 | 触发手势 |
| --- | --- | --- |
| 01 | LINE | 食指 · 单线 |
| 02 | PLANE | 拇指 + 食指 |
| 03 | TRI-PRISM | 三指 · 三棱体 |
| 04 | QUAD-PRISM | 四指 · 四棱体 |
| 05 | PENTA-PRISM | 五指 · 五棱体 |

### 技术栈 / Tech Stack

- 纯静态 HTML / CSS / JavaScript
- MediaPipe Tasks Vision（`@mediapipe/tasks-vision`）
- WASM 运行时通过 jsDelivr CDN 加载
- 手部模型：`models/hand_landmarker.task`（随仓库部署，不依赖外部模型源）
- 无构建步骤，无后端服务

### 本地运行 / Run Locally

因为浏览器要求摄像头必须在安全上下文运行，直接用 `file://` 打开 `index.html` 通常会失败。  
请起一个本地静态服务器：
bash
Python
python -m http.server 8000
或 Node
npx http-server -p 8000
然后浏览器打开：
http://localhost:8000

### 摄像头打不开 / CAMERA ERROR 怎么办？

- 用 **Chrome / Edge 桌面版**
- 地址栏允许摄像头权限
- 不要在 `file://` 下运行
- 检查系统设置里是否禁用了浏览器摄像头
- 其他程序（Zoom / 微信 / OBS）占用了摄像头，先关掉
- 公司/学校网络或扩展插件也可能拦截摄像头

---

## English

LIQUID SPACE is a static web experiment. It captures 21 hand landmarks via webcam and turns finger combinations into generative geometry: lines, planes, tri-prism, quad-prism, penta-prism.

### Gesture Modes

| Mode | Name | Trigger |
| --- | --- | --- |
| 01 | LINE | Index finger only |
| 02 | PLANE | Thumb + Index |
| 03 | TRI-PRISM | Three fingers |
| 04 | QUAD-PRISM | Four fingers |
| 05 | PENTA-PRISM | Five fingers |

### Tech Stack

- Static HTML / CSS / JavaScript
- MediaPipe Tasks Vision
- WASM runtime loaded from jsDelivr CDN
- Model: `models/hand_landmarker.task`
- No build step, no backend

### Run Locally

Camera access requires a secure context. `file://` usually fails.
bash
python -m http.server 8000
Open:
http://localhost:8000

### Camera / CAMERA ERROR

- Use desktop Chrome or Edge
- Allow camera permission
- Do not open via `file://`
- Close Zoom / OBS / WeChat that may lock the camera
- Check OS privacy settings

---

## 项目结构 / Project Structure
.
├── index.html
├── script1.js
├── style.css
├── README.md
├── models/
│ └── hand_landmarker.task
└── package.json # 仅记录依赖来源，不是构建配置

## 部署 / Deployment

项目通过 GitHub Pages 部署：

1. 推送到 `main` 分支
2. Settings → Pages → Branch: `main` / Folder: `/root`
3. 访问 `https://<username>.github.io/<repo>/`

## License

For learning / demo use.






