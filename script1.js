const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const statusText = document.getElementById("statusText");
const modeInfo = document.getElementById("modeInfo");
const handInfo = document.getElementById("handInfo");
const fpsText = document.getElementById("fpsText");
const footerMode = document.getElementById("footerMode");

let handLandmarker = null;
let lastVideoTime = -1;

let mode = 1;
let animationTime = 0;

let hands = {
    left: null,
    right: null
};


/* =========================================================
   1. 五种模式
========================================================= */

const modeFingers = {

    // 模式1：只使用食指
    1: [
        "index"
    ],

    // 模式2：拇指 + 食指
    2: [
        "thumb",
        "index"
    ],

    // 模式3：拇指 + 食指 + 中指
    3: [
        "thumb",
        "index",
        "middle"
    ],

    // 模式4：拇指 + 食指 + 中指 + 无名指
    4: [
        "thumb",
        "index",
        "middle",
        "ring"
    ],

    // 模式5：五根手指
    5: [
        "thumb",
        "index",
        "middle",
        "ring",
        "pinky"
    ]

};


/* =========================================================
   2. MediaPipe 手指关键点
========================================================= */

const fingerLandmarks = {

    thumb: 4,

    index: 8,

    middle: 12,

    ring: 16,

    pinky: 20

};


/* =========================================================
   3. 模式名称
========================================================= */

const modeNames = {

    1: "MODE 01 / TWO INDEX FINGERS",

    2: "MODE 02 / THUMB + INDEX PLANE",

    3: "MODE 03 / THREE-FINGER TRI-PRISM",

    4: "MODE 04 / FOUR-FINGER QUAD-PRISM",

    5: "MODE 05 / FIVE-FINGER PENTA-PRISM"

};


/* =========================================================
   4. 切换模式
========================================================= */

function setMode(newMode) {

    mode = Number(newMode);

    document
        .querySelectorAll(".mode-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                Number(button.dataset.mode) === mode
            );

        });

    modeInfo.textContent =
        modeNames[mode];

    footerMode.textContent =
        String(mode).padStart(2, "0");

}


/* =========================================================
   5. 绑定模式按钮
========================================================= */

document
    .querySelectorAll(".mode-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setMode(
                    button.dataset.mode
                );

            }
        );

    });


/* =========================================================
   6. 打开摄像头
========================================================= */

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: "user",

                    width: {
                        ideal: 1280
                    },

                    height: {
                        ideal: 720
                    }

                },

                audio: false

            });


        video.srcObject = stream;

        statusText.textContent =
            "CAMERA ONLINE";


        video.addEventListener(
            "loadeddata",
            () => {

                initializeMediaPipe();

            },
            {
                once: true
            }
        );


    } catch (error) {

        console.error(error);

        statusText.textContent =
            "CAMERA ERROR";

    }

}


/* =========================================================
   7. 初始化 MediaPipe
========================================================= */

async function initializeMediaPipe() {

    try {

        statusText.textContent =
            "LOADING MODEL";


        const vision =
            await FilesetResolver.forVisionTasks(

                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"

            );


        handLandmarker =
            await HandLandmarker.createFromOptions(

                vision,

                {

                    baseOptions: {

                        modelAssetPath:
                            "./models/hand_landmarker.task"

                    },


                    runningMode:
                        "VIDEO",


                    numHands:
                        2,


                    minHandDetectionConfidence:
                        0.55,


                    minHandPresenceConfidence:
                        0.55,


                    minTrackingConfidence:
                        0.55

                }

            );


        statusText.textContent =
            "TRACKING ONLINE";


        startDetection();


    } catch (error) {

        console.error(error);

        statusText.textContent =
            "MODEL ERROR";

    }

}


/* =========================================================
   8. 开始检测
========================================================= */

function startDetection() {

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    detectHands();

}


/* =========================================================
   9. Canvas尺寸
========================================================= */

function resizeCanvas() {

    if (
        !video.videoWidth ||
        !video.videoHeight
    ) {

        return;

    }


    canvas.width =
        video.videoWidth;


    canvas.height =
        video.videoHeight;

}


/* =========================================================
   10. 每一帧检测
========================================================= */

function detectHands() {

    if (
        !handLandmarker ||
        video.readyState < 2
    ) {

        requestAnimationFrame(
            detectHands
        );

        return;

    }


    animationTime += 0.016;


    if (
        video.currentTime !==
        lastVideoTime
    ) {

        lastVideoTime =
            video.currentTime;


        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        const results =
            handLandmarker.detectForVideo(

                video,

                video.currentTime * 1000

            );


        hands.left = null;
        hands.right = null;


        if (
            results.landmarks
        ) {

            processHands(
                results
            );

        }


        drawGeometry();


        updateUI(

            results.landmarks
                ? results.landmarks.length
                : 0

        );

    }


    requestAnimationFrame(
        detectHands
    );

}


/* =========================================================
   11. 处理两只手
========================================================= */

function processHands(results) {

    for (
        let i = 0;
        i < results.landmarks.length;
        i++
    ) {

        const landmarks =
            results.landmarks[i];


        const handedness =
            results
                .handedness[i][0]
                .categoryName;


        const points = {};


        /*
         * 提取五个手指尖端
         */

        for (
            const [
                finger,
                landmarkIndex
            ]
            of Object.entries(
                fingerLandmarks
            )
        ) {

            const point =
                landmarks[
                    landmarkIndex
                ];


            points[finger] = {

                x:
                    point.x *
                    canvas.width,

                y:
                    point.y *
                    canvas.height

            };

        }


        /*
         * 保存左右手
         */

        if (
            handedness === "Left"
        ) {

            hands.left =
                points;

        }


        if (
            handedness === "Right"
        ) {

            hands.right =
                points;

        }


        /*
         * 绘制手部关键点
         */

        drawLandmarks(
            landmarks
        );

    }

}


/* =========================================================
   12. 绘制手部关键点
========================================================= */

function drawLandmarks(landmarks) {

    for (
        let i = 0;
        i < landmarks.length;
        i++
    ) {

        const point =
            landmarks[i];


        const x =
            point.x *
            canvas.width;


        const y =
            point.y *
            canvas.height;


        const isFingerTip =

            i === 4 ||
            i === 8 ||
            i === 12 ||
            i === 16 ||
            i === 20;


        ctx.save();


        if (isFingerTip) {

            /*
             * 五个指尖
             */

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(235,255,252,0.90)";


            ctx.shadowBlur =
                12;


            ctx.shadowColor =
                "rgba(155,255,239,0.50)";


            ctx.fill();


        } else {

            /*
             * 其他手部关键点
             */

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                2.1,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(210,245,240,0.28)";


            ctx.fill();

        }


        ctx.restore();

    }

}


/* =========================================================
   13. 根据当前模式绘制
========================================================= */

function drawGeometry() {

    const hasTwoHands = hands.left && hands.right;

    if (hasTwoHands) {

        /* 两只手：保留原有功能 */
        if (mode === 1) {
            drawMode1();
            return;
        }

        if (mode === 2) {
            drawMode2();
            return;
        }

        drawPrismMode(modeFingers[mode]);

    } else {

        /* 一只手：单手模式 */
        const singleHand = hands.left || hands.right;
        if (!singleHand) return;

        const fingers = modeFingers[mode];
        const points = fingers
            .map(finger => singleHand[finger])
            .filter(Boolean);

        if (points.length < 2) {
            /* 模式1：单指 - 只画一个节点 */
            if (points.length === 1) {
                drawLiquidNode(points[0], 0);
            }
            return;
        }

        if (points.length === 2) {
            /* 模式2：两指成线 */
            drawSoftConnection(points[0], points[1], 0);
            drawLiquidNode(points[0], 0);
            drawLiquidNode(points[1], 0.45);
            return;
        }

        /* 三指及以上：成面 */
        drawGlassPolygon(points, "plane");

        /* 连接所有手指成闭合环 */
        for (let i = 0; i < points.length; i++) {
            const next = (i + 1) % points.length;
            drawSoftConnection(points[i], points[next], i * 0.18);
        }

        /* 所有节点 */
        for (let i = 0; i < points.length; i++) {
            drawLiquidNode(points[i], i * 0.17);
        }
    }

}


/* =========================================================
   14. 模式1
   两只手食指 → 一条线
========================================================= */

function drawMode1() {

    const left =
        hands.left.index;


    const right =
        hands.right.index;


    if (
        !left ||
        !right
    ) {

        return;

    }


    /*
     * 柔和液态连接线
     */

    drawSoftConnection(
        left,
        right
    );


    /*
     * 液态节点
     */

    drawLiquidNode(
        left,
        0
    );


    drawLiquidNode(
        right,
        0.45
    );

}


/* =========================================================
   15. 模式2
   拇指 + 食指 → 四边形
========================================================= */

function drawMode2() {

    const LT =
        hands.left.thumb;


    const LI =
        hands.left.index;


    const RI =
        hands.right.index;


    const RT =
        hands.right.thumb;


    if (
        !LT ||
        !LI ||
        !RI ||
        !RT
    ) {

        return;

    }


    /*
     * 液态玻璃四边形
     */

    drawGlassPolygon(

        [
            LT,
            LI,
            RI,
            RT
        ],

        "plane"

    );


    /*
     * 两条横向连接
     */

    drawSoftConnection(
        LT,
        RT
    );


    drawSoftConnection(
        LI,
        RI
    );


    /*
     * 四个液态节点
     */

    drawLiquidNode(
        LT,
        0
    );


    drawLiquidNode(
        LI,
        0.2
    );


    drawLiquidNode(
        RI,
        0.4
    );


    drawLiquidNode(
        RT,
        0.6
    );

}


/* =========================================================
   16. 模式3 / 4 / 5
   通用棱柱
========================================================= */

function drawPrismMode(fingers) {

    /*
     * 左侧截面
     */

    const leftPoints =
        fingers
            .map(
                finger =>
                    hands.left[finger]
            )
            .filter(Boolean);


    /*
     * 右侧截面
     */

    const rightPoints =
        fingers
            .map(
                finger =>
                    hands.right[finger]
            )
            .filter(Boolean);


    /*
     * 如果没有完整识别
     * 就不绘制
     */

    if (

        leftPoints.length !==
            fingers.length ||

        rightPoints.length !==
            fingers.length

    ) {

        return;

    }


    /*
     * 左侧端面
     */

    drawGlassPolygon(
        leftPoints,
        "end"
    );


    /*
     * 右侧端面
     *
     * 反向排列，保证面方向正确
     */

    drawGlassPolygon(
        [...rightPoints].reverse(),
        "end"
    );


    /*
     * 左右手对应手指连接
     */

    for (
        let i = 0;
        i < fingers.length;
        i++
    ) {

        drawSoftConnection(

            leftPoints[i],

            rightPoints[i],

            i * 0.18

        );

    }


    /*
     * 相邻手指之间形成侧面
     */

    for (
        let i = 0;
        i < fingers.length - 1;
        i++
    ) {

        drawGlassPolygon(

            [

                leftPoints[i],

                leftPoints[i + 1],

                rightPoints[i + 1],

                rightPoints[i]

            ],

            "side"

        );

    }


    /*
     * 所有节点
     */

    for (
        let i = 0;
        i < fingers.length;
        i++
    ) {

        drawLiquidNode(

            leftPoints[i],

            i * 0.17

        );


        drawLiquidNode(

            rightPoints[i],

            0.5 + i * 0.17

        );

    }

}


/* =========================================================
   17. 绘制液态玻璃面
========================================================= */

function drawGlassPolygon(
    points,
    type = "side"
) {

    if (
        !points ||
        points.length < 3
    ) {

        return;

    }


    const center =
        getPolygonCenter(
            points
        );


    /*
     * 第一层：
     * 非常柔和的玻璃阴影
     */

    ctx.save();


    movePolygonPath(
        points
    );


    ctx.shadowBlur =
        type === "plane"
            ? 34
            : 26;


    ctx.shadowColor =
        "rgba(150,255,238,0.20)";


    ctx.fillStyle =
        "rgba(130,235,225,0.055)";


    ctx.fill();


    ctx.restore();


    /*
     * 第二层：
     * 半透明液态玻璃主体
     */

    ctx.save();


    movePolygonPath(
        points
    );


    const bounds =
        getBounds(
            points
        );


    const gradient =
        ctx.createLinearGradient(

            bounds.minX,

            bounds.minY,

            bounds.maxX,

            bounds.maxY

        );


    if (
        type === "plane"
    ) {

        gradient.addColorStop(

            0,

            "rgba(226,255,251,0.20)"

        );


        gradient.addColorStop(

            0.30,

            "rgba(135,242,228,0.105)"

        );


        gradient.addColorStop(

            0.72,

            "rgba(111,179,255,0.07)"

        );


        gradient.addColorStop(

            1,

            "rgba(255,255,255,0.12)"

        );

    } else {

        gradient.addColorStop(

            0,

            "rgba(228,255,251,0.15)"

        );


        gradient.addColorStop(

            0.5,

            "rgba(112,226,216,0.075)"

        );


        gradient.addColorStop(

            1,

            "rgba(125,177,255,0.055)"

        );

    }


    ctx.fillStyle =
        gradient;


    ctx.fill();


    ctx.restore();


    /*
     * 第三层：
     * 玻璃边缘
     */

    ctx.save();


    movePolygonPath(
        points
    );


    ctx.lineWidth =
        type === "plane"
            ? 1.8
            : 1.35;


    ctx.strokeStyle =
        "rgba(218,255,251,0.48)";


    ctx.shadowBlur =
        12;


    ctx.shadowColor =
        "rgba(170,255,242,0.18)";


    ctx.stroke();


    ctx.restore();


    /*
     * 内部柔和高光
     */

    drawPolygonHighlight(
        points,
        center
    );


    /*
     * 液态扫描光
     */

    drawLiquidSweep(
        points,
        bounds
    );

}


/* =========================================================
   18. 玻璃面内部高光
========================================================= */

function drawPolygonHighlight(
    points,
    center
) {

    if (
        points.length < 3
    ) {

        return;

    }


    ctx.save();


    ctx.globalCompositeOperation =
        "screen";


    const radius =
        Math.max(

            30,

            Math.min(

                canvas.width,

                canvas.height

            ) * 0.13

        );


    const glow =
        ctx.createRadialGradient(

            center.x -
                radius * 0.35,

            center.y -
                radius * 0.45,

            0,

            center.x,

            center.y,

            radius

        );


    glow.addColorStop(

        0,

        "rgba(255,255,255,0.13)"

    );


    glow.addColorStop(

        0.35,

        "rgba(191,255,247,0.055)"

    );


    glow.addColorStop(

        1,

        "rgba(255,255,255,0)"

    );


    ctx.beginPath();


    movePolygonPath(
        points
    );


    ctx.clip();


    ctx.fillStyle =
        glow;


    ctx.fillRect(

        center.x - radius,

        center.y - radius,

        radius * 2,

        radius * 2

    );


    ctx.restore();

}


/* =========================================================
   19. 液态扫描高光
========================================================= */

function drawLiquidSweep(
    points,
    bounds
) {

    ctx.save();


    ctx.beginPath();


    movePolygonPath(
        points
    );


    ctx.clip();


    const width =
        Math.max(

            60,

            bounds.maxX -
            bounds.minX

        );


    const travel =
        (
            Math.sin(
                animationTime * 0.55
            ) + 1
        ) / 2;


    const sweepX =
        bounds.minX +
        width * travel;


    const gradient =
        ctx.createLinearGradient(

            sweepX - 35,

            0,

            sweepX + 35,

            0

        );


    gradient.addColorStop(

        0,

        "rgba(255,255,255,0)"

    );


    gradient.addColorStop(

        0.5,

        "rgba(255,255,255,0.055)"

    );


    gradient.addColorStop(

        1,

        "rgba(255,255,255,0)"

    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        bounds.minX,

        bounds.minY,

        bounds.maxX -
            bounds.minX,

        bounds.maxY -
            bounds.minY

    );


    ctx.restore();

}


/* =========================================================
   20. 柔和液态连接线
========================================================= */

function drawSoftConnection(
    from,
    to,
    phase = 0
) {

    if (
        !from ||
        !to
    ) {

        return;

    }


    ctx.save();


    const dx =
        to.x - from.x;


    const dy =
        to.y - from.y;


    const length =
        Math.hypot(
            dx,
            dy
        );


    if (
        length < 1
    ) {

        ctx.restore();

        return;

    }


    /*
     * 垂直方向
     */

    const nx =
        -dy / length;


    const ny =
        dx / length;


    /*
     * 液态轻微波动
     */

    const wave =
        Math.sin(

            animationTime *
                1.25 +

            phase * 4

        ) * 1.8;


    const midX =
        (from.x + to.x) / 2 +
        nx * wave;


    const midY =
        (from.y + to.y) / 2 +
        ny * wave;


    /*
     * 第一层：
     * 很淡的柔光
     */

    ctx.beginPath();


    ctx.moveTo(
        from.x,
        from.y
    );


    ctx.quadraticCurveTo(

        midX,

        midY,

        to.x,

        to.y

    );


    ctx.lineWidth =
        6;


    ctx.strokeStyle =
        "rgba(140,255,238,0.035)";


    ctx.shadowBlur =
        18;


    ctx.shadowColor =
        "rgba(150,255,240,0.16)";


    ctx.stroke();


    /*
     * 第二层：
     * 极细玻璃线
     */

    ctx.beginPath();


    ctx.moveTo(
        from.x,
        from.y
    );


    ctx.quadraticCurveTo(

        midX,

        midY,

        to.x,

        to.y

    );


    ctx.lineWidth =
        1.25;


    ctx.strokeStyle =
        "rgba(218,255,250,0.42)";


    ctx.stroke();


    /*
     * 在线上流动的小高光
     */

    const t =
        (
            Math.sin(

                animationTime *
                    0.9 +

                phase * 3

            ) + 1
        ) / 2;


    const px =
        quadratic(

            from.x,

            midX,

            to.x,

            t

        );


    const py =
        quadratic(

            from.y,

            midY,

            to.y,

            t

        );


    ctx.beginPath();


    ctx.arc(

        px,

        py,

        2.5,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "rgba(245,255,253,0.72)";


    ctx.shadowBlur =
        12;


    ctx.shadowColor =
        "rgba(180,255,245,0.45)";


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   21. 二次贝塞尔曲线计算
========================================================= */

function quadratic(
    a,
    b,
    c,
    t
) {

    return (

        (1 - t) *
        (1 - t) *
        a

        +

        2 *
        (1 - t) *
        t *
        b

        +

        t *
        t *
        c

    );

}


/* =========================================================
   22. 液态节点
========================================================= */

function drawLiquidNode(
    point,
    phase = 0
) {

    if (
        !point
    ) {

        return;

    }


    ctx.save();


    /*
     * 微弱呼吸动画
     */

    const pulse =

        1 +

        Math.sin(

            animationTime *
                1.7 +

            phase * 5

        ) * 0.08;


    const r =
        8 * pulse;


    /*
     * 外部柔光
     */

    ctx.beginPath();


    ctx.arc(

        point.x,

        point.y,

        r * 2.2,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "rgba(145,255,238,0.025)";


    ctx.shadowBlur =
        24;


    ctx.shadowColor =
        "rgba(145,255,238,0.24)";


    ctx.fill();


    /*
     * 液态玻璃球
     */

    const gradient =
        ctx.createRadialGradient(

            point.x -
                r * 0.35,

            point.y -
                r * 0.42,

            0,

            point.x,

            point.y,

            r

        );


    gradient.addColorStop(

        0,

        "rgba(255,255,255,0.95)"

    );


    gradient.addColorStop(

        0.18,

        "rgba(222,255,249,0.74)"

    );


    gradient.addColorStop(

        0.55,

        "rgba(139,239,224,0.30)"

    );


    gradient.addColorStop(

        1,

        "rgba(102,183,255,0.08)"

    );


    ctx.beginPath();


    ctx.arc(

        point.x,

        point.y,

        r,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        gradient;


    ctx.shadowBlur =
        10;


    ctx.shadowColor =
        "rgba(160,255,239,0.28)";


    ctx.fill();


    /*
     * 小高光
     */

    ctx.beginPath();


    ctx.arc(

        point.x -
            r * 0.32,

        point.y -
            r * 0.35,

        r * 0.23,

        0,

        Math.PI * 2

    );


    ctx.fillStyle =
        "rgba(255,255,255,0.72)";


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   23. 绘制多边形路径
========================================================= */

function movePolygonPath(
    points
) {

    ctx.beginPath();


    ctx.moveTo(

        points[0].x,

        points[0].y

    );


    for (
        let i = 1;
        i < points.length;
        i++
    ) {

        ctx.lineTo(

            points[i].x,

            points[i].y

        );

    }


    ctx.closePath();

}


/* =========================================================
   24. 计算多边形中心
========================================================= */

function getPolygonCenter(
    points
) {

    let x = 0;
    let y = 0;


    for (
        const point of points
    ) {

        x += point.x;
        y += point.y;

    }


    return {

        x:
            x /
            points.length,

        y:
            y /
            points.length

    };

}


/* =========================================================
   25. 计算包围盒
========================================================= */

function getBounds(
    points
) {

    let minX =
        Infinity;

    let minY =
        Infinity;

    let maxX =
        -Infinity;

    let maxY =
        -Infinity;


    for (
        const point of points
    ) {

        minX =
            Math.min(
                minX,
                point.x
            );


        minY =
            Math.min(
                minY,
                point.y
            );


        maxX =
            Math.max(
                maxX,
                point.x
            );


        maxY =
            Math.max(
                maxY,
                point.y
            );

    }


    return {

        minX,
        minY,
        maxX,
        maxY

    };

}


/* =========================================================
   26. UI状态
========================================================= */

function updateUI(
    numberOfHands
) {

    handInfo.textContent =
        `HANDS ${numberOfHands} / 2`;

}


/* =========================================================
   27. FPS
========================================================= */

let fpsLastTime =
    performance.now();


let fpsFrames = 0;


function updateFPS() {

    fpsFrames++;


    const now =
        performance.now();


    if (
        now -
        fpsLastTime >=
        1000
    ) {

        fpsText.textContent =
            `${fpsFrames} FPS`;


        fpsFrames = 0;


        fpsLastTime =
            now;

    }


    requestAnimationFrame(
        updateFPS
    );

}


/* =========================================================
   28. 启动
========================================================= */

setMode(1);

updateFPS();

startCamera();