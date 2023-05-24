<!--  -->
<template>
  <div class="main-box">
    <div class="top">画板</div>
    <div class="draw">
      <div class="control-box">
        <div class="upload-image-text" style="margin-bottom: 10px">
          上传背景：
        </div>
        <div class="upload-image" style="margin-bottom: 20px">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/gif,image/png,image/bmp"
            id="upload-file"
            @change="uploadImage"
          />
        </div>
        <div class="draw-operate-text" style="margin-bottom: 10px">
          画布操作：
        </div>
        <div
          class="draw-operate"
          style="margin-bottom: 15px; display: flex; align-items: center"
        >
          <el-tooltip placement="top">
            <template #content>撤销</template>
            <img
              :src="
                currentCanvas == 0
                  ? getImageByPath('../assets/image/revoke_disable.png')
                  : getImageByPath('../assets/image/revoke.png')
              "
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              @click="revokeDraw"
            />
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content>恢复</template>
            <img
              :src="
                currentCanvas >= canvasHistory.length - 1
                  ? getImageByPath('../assets/image/restore_disable.png')
                  : getImageByPath('../assets/image/restore.png')
              "
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              @click="restoreDraw"
            />
          </el-tooltip>
          <el-popconfirm title="确定要清除画布吗?" @confirm="resetDraw">
            <template #reference>
              <span>
                <el-tooltip placement="top">
                  <template #content>恢复</template>
                  <img
                    :src="getImageByPath('../assets/image/clen.png')"
                    alt=""
                    width="20"
                    height="20"
                    style="margin-right: 10px"
                  />
                </el-tooltip>
              </span>
            </template>
          </el-popconfirm>
          <el-tooltip placement="top">
            <template #content>清除背景</template>
            <img
              :src="getImageByPath('../assets/image/del_bg.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              @click="delBg"
            />
          </el-tooltip>
        </div>
        <div class="draw-scale-text" style="margin-bottom: 10px">
          画布缩放：
        </div>
        <div class="draw-scale">
          <el-slider v-model="scaleControl" :format-tooltip="scaleFormat" />
        </div>
        <div class="draw-tool-text" style="margin-bottom: 10px">工具选择：</div>
        <div class="draw-tool" style="margin-bottom: 20px">
          <el-tooltip placement="top">
            <template #content>移动</template>
            <img
              :src="getImageByPath('../assets/image/move.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="MouseState == 'MOVE_MODE' ? 'chose' : ''"
              @click="changeMouseState('MOVE_MODE')"
            />
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content>钢笔</template>
            <img
              :src="getImageByPath('../assets/image/pen.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="MouseState == 'LINE_MODE' ? 'chose' : ''"
              @click="changeMouseState('LINE_MODE')"
            />
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content>橡皮擦</template>
            <img
              :src="getImageByPath('../assets/image/eraser.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="MouseState == 'ERASER_MODE' ? 'chose' : ''"
              @click="changeMouseState('ERASER_MODE')"
            />
          </el-tooltip>
        </div>
        <div class="shpaes-text" style="margin-bottom: 10px">形状：</div>
        <div class="shpaes" style="margin-bottom: 20px">
          <el-tooltip placement="top">
            <template #content>直线</template>
            <img
              :src="getImageByPath('../assets/image/line.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="
                MouseState == 'SHAPE_MODE' && ShapeState == 'LINE_MODE'
                  ? 'chose'
                  : ''
              "
              @click="changeMouseState('SHAPE_MODE', 'LINE_MODE')"
            />
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content>矩形</template>
            <img
              :src="getImageByPath('../assets/image/rectangle.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="
                MouseState == 'SHAPE_MODE' && ShapeState == 'RECTANGLE_MODE'
                  ? 'chose'
                  : ''
              "
              @click="changeMouseState('SHAPE_MODE', 'RECTANGLE_MODE')"
            />
          </el-tooltip>
          <el-tooltip placement="top">
            <template #content>圆</template>
            <img
              :src="getImageByPath('../assets/image/round.png')"
              alt=""
              width="20"
              height="20"
              style="margin-right: 10px"
              :class="
                MouseState == 'SHAPE_MODE' && ShapeState == 'ROUND_MODE'
                  ? 'chose'
                  : ''
              "
              @click="changeMouseState('SHAPE_MODE', 'ROUND_MODE')"
            />
          </el-tooltip>
        </div>
        <div class="line-size-text" style="margin-bottom: 10px">线条大小：</div>
        <div class="line-size" style="margin-bottom: 20px">
          <el-dropdown
            trigger="click"
            @command="(command) => (lineWidth = parseInt(command))"
          >
            <span
              style="display: flex; align-items: center; padding:10px; border 1px solid gray"
            >
              <span
                :style="`width: 100px; height: ${lineWidth}px; background-color: black;`"
              ></span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="1"
                  ><span>1px</span
                  ><span
                    :style="`width: 100px; height: 1px; background-color: black; margin: 5px`"
                  ></span
                ></el-dropdown-item>
                <el-dropdown-item command="3"
                  ><span>3px</span
                  ><span
                    :style="`width: 100px; height: 3px; background-color: black; margin: 5px`"
                  ></span
                ></el-dropdown-item>
                <el-dropdown-item command="5"
                  ><span>5px</span
                  ><span
                    :style="`width: 100px; height: 5px; background-color: black; margin: 5px`"
                  ></span
                ></el-dropdown-item>
                <el-dropdown-item command="8"
                  ><span>8px</span
                  ><span
                    :style="`width: 100px; height: 8px; background-color: black; margin: 5px`"
                  ></span
                ></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div
          class="line-color-text"
          style="margin-bottom: 10px; display: flex; align-items: center"
        >
          线条颜色：
          <div
            style="
              display: flex;
              padding: 2px;
              border: 0.5px solid #909399;
              border-radius: 50%;
            "
          >
            <span
              :style="`width: 20px; height: 20px; border-radius: 50%; background-color: ${lineColor}`"
            ></span>
          </div>
        </div>
        <div class="line-color" style="margin-bottom: 20px; display: flex">
          <div class="chose-color-border" @click="lineColor = '#fb050d'">
            <span class="chose-color" style="background-color: #fb050d"></span>
          </div>
          <div class="chose-color-border" @click="lineColor = '#2ca9e1'">
            <span class="chose-color" style="background-color: #2ca9e1"></span>
          </div>
          <div class="chose-color-border" @click="lineColor = '#ffea00'">
            <span class="chose-color" style="background-color: #ffea00"></span>
          </div>
          <div class="chose-color-border" @click="lineColor = '#68be8d'">
            <span class="chose-color" style="background-color: #68be8d"></span>
          </div>
          <div class="chose-color-border" @click="lineColor = '#f09199'">
            <span class="chose-color" style="background-color: #f09199"></span>
          </div>
          <el-color-picker v-model="lineColor" />
        </div>
        <el-button @click="saveImage">保存图片</el-button>
      </div>
      <div class="draw-box" id="wrap" ref="wrap">
        <canvas id="canvas" width="1150" height="650" ref="canvas"></canvas>
        <canvas
          id="imgCanvas"
          width="1150"
          height="650"
          ref="imgCanvas"
        ></canvas>
        <canvas
          id="saveCanvas"
          width="1150"
          height="650"
          ref="saveCanvas"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
// 请求图片工具方法
import getImageByPath from "../utils/getImageByPath";
// 文件下载工具方法
import downFile from "../utils/downFile";

/**
 * 画布元素：
 *   canvas 主画布
 *   imgCanvas 背景图画布
 *    saveCanvas 保存功能的媒介画布
 */
const canvas = ref(null);
const imgCanvas = ref(null);
const saveCanvas = ref(null);

/**
 *  各画布的渲染上下文 依次对应
 */

var ctx;
var imgCtx;
var saveCtx;

// 画布容器元素
const wrap = ref(null);

// 画布当前状态位置
const currentCanvas = ref(0);
// 存储画布状态
var canvasHistory = [];

// 滑动控件绑定参数
const scaleControl = ref(50);
// 当前线段宽度
const lineWidth = ref(3);
// 当前线段颜色
const lineColor = ref("#000");
// 橡皮宽度
const eraserWidth = ref(16);

/**
 * 鼠标状态：
 *    MOVE_MODE : 移动模式
 *    LINE_MODE ：画笔模式
 *    ERASER_MODE ：橡皮模式
 *    SHAPE_MODE  ： 形状模式
 */
const MouseState = ref("MOVE_MODE");

/**
 *  SHAPE_MODE绘制的形状：
 *    LINE_MODE：线段
 *    RECTANGLE_MODE：矩形与正方形
 *    ROUND_MODE：椭圆与圆形
 */
const ShapeState = ref("");

// 画布放大倍数
var canvasScale = 1;

// 画布偏移量
var translatePointX = 0;
var translatePointY = 0;

// 上次移动的偏移量
var fillStartPointX = 0;
var fillStartPointY = 0;

// 是否按下shift
var shiftDown = false;

onMounted(async () => {
  // 创建canvas的2d渲染上下文
  ctx = canvas.value.getContext("2d");
  imgCtx = imgCanvas.value.getContext("2d");
  saveCtx = saveCanvas.value.getContext("2d");

  // 将主画布设为透明方便后面合并
  ctx.fillStyle = "rgba(255, 255, 255, 0)";

  // 初始化画布状态
  const canvasData = ctx.getImageData(
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  canvasHistory = [];
  canvasHistory.push(canvasData);
  currentCanvas.value = 0;

  // 设置画布中心为放大原点
  canvas.value.style.transformOrigin = `${wrap.value.offsetWidth / 2}px ${
    wrap.value.offsetHeight / 2
  }px`;

  imgCanvas.value.style.transformOrigin = `${wrap.value.offsetWidth / 2}px ${
    wrap.value.offsetHeight / 2
  }px`;

  // 启动监听
  handleCanvs();
  changeMouseState("MOVE_MODE");
});

// 更换背景图
const uploadImage = () => {
  const uploadFile = document.getElementById("upload-file");
  const file = uploadFile.files[0];
  // 创建image实例即 <img/>
  const image = new Image();
  image.src = window.URL.createObjectURL(file);

  // 实例准备完成后渲染到背景图画布上
  image.onload = () => {
    imgCtx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
    upDataCanvas();
  };
};

// 清除背景
const delBg = () => {
  // 将整个背景画布涂白即可
  imgCtx.fillStyle = "#fff";
  imgCtx.fillRect(0, 0, imgCanvas.value.width, imgCanvas.value.height);
  upDataCanvas();
};

// 监听鼠标按下以及滚轮事件
const handleCanvs = () => {
  wrap.value.onmousedown = null;
  wrap.value.onmousedown = function (event) {
    // 获取当前鼠标坐标
    const downX = event.pageX;
    const downY = event.pageY;

    // 设置画出的线条样式
    ctx.strokeStyle = lineColor.value;
    ctx.lineWidth = lineWidth.value;

    // 计算容器的位置
    const offsetX = parseInt(wrap.value.offsetLeft);
    const offsetY = parseInt(wrap.value.offsetTop);

    // 根据鼠标状态判断执行什么方法
    switch (MouseState.value) {
      case "MOVE_MODE":
        handleMoveMode(downX, downY);
        break;
      case "LINE_MODE":
        handleLineMode(downX - offsetX, downY - offsetY, offsetX, offsetY);
        break;
      case "ERASER_MODE":
        handleLineMode(downX - offsetX, downY - offsetY, offsetX, offsetY);
        break;
      case "SHAPE_MODE":
        handleShapeMode(downX - offsetX, downY - offsetY, offsetX, offsetY);
        break;
      default:
        break;
    }
  };

  // 监听数鼠标滚动
  wrap.value.onwheel = null;
  wrap.value.onwheel = (event) => {
    const { deltaY } = event;
    const newScale =
      deltaY > 0
        ? (canvasScale * 10 - 0.1 * 10) / 10
        : (canvasScale * 10 + 0.1 * 10) / 10;
    if (newScale >= 0.1 || newScale <= 2) {
      canvasScale = newScale;
      scaleControl.value =
        deltaY > 0 ? scaleControl.value + 1 : scaleControl.value - 1;
      setcanvasScale();
    }
  };
};

// 监听滑动控件设置放大倍数
watch(scaleControl, (value) => {
  canvasScale = 2 * (value / 100) < 0.1 ? 0.1 : 2 * (value / 100);
  setcanvasScale();
});

// 格式化滑动控件显示
const scaleFormat = (value) => {
  return 2 * (value / 100) < 0.1 ? 0.1 : 2 * (value / 100);
};

// 设置画布位置及缩放
const setcanvasScale = () => {
  canvas.value &&
    (canvas.value.style.transform = `scale(${canvasScale}, ${canvasScale}) translate(${translatePointX}px, ${translatePointY}px)`);
  imgCanvas.value &&
    (imgCanvas.value.style.transform = `scale(${canvasScale}, ${canvasScale}) translate(${translatePointX}px, ${translatePointY}px)`);
};

// 根据鼠标状态设置鼠标样式
const changeMouseState = (state, shapeState = "") => {
  MouseState.value = state;
  if (shapeState) {
    ShapeState.value = shapeState;
  }

  switch (MouseState.value) {
    case "MOVE_MODE":
      canvas.value.style.cursor = `url(${getImageByPath(
        "../assets/icon/move.svg"
      )}) 6 26, auto`;
      break;
    case "LINE_MODE":
      canvas.value.style.cursor = `url(${getImageByPath(
        "../assets/icon/pen.svg"
      )}) 6 26, pointer`;
      break;
    case "ERASER_MODE":
      canvas.value.style.cursor = `url(${getImageByPath(
        "../assets/icon/eraser.svg"
      )}) 6 26, pointer`;
      break;
    case "SHAPE_MODE":
      canvas.value.style.cursor = `url(${getImageByPath(
        "../assets/icon/shape.svg"
      )}) 16 16, pointer`;
      break;
    default:
      canvas.style.cursor = "default";
      wrap.value.style.cursor = "default";
      break;
  }
};

// 移动模式下监听方法
const handleMoveMode = (downX, downY) => {
  // 获取上次移动完成的偏移量
  const fillStartPointx = fillStartPointX;
  const fillStartPointy = fillStartPointY;

  wrap.value.onmousemove = (event) => {
    const moveX = event.pageX;
    const moveY = event.pageY;

    // 得出当前移动的偏移量
    translatePointX = fillStartPointx + (moveX - downX);
    translatePointY = fillStartPointy + (moveY - downY);

    setcanvasScale();
  };

  wrap.value.onmouseup = (event) => {
    const upX = event.pageX;
    const upY = event.pageY;

    wrap.value.onmousemove = null;
    wrap.value.onmouseup = null;

    // 设置最后的偏移量
    fillStartPointX = fillStartPointx + (upX - downX);
    fillStartPointY = fillStartPointy + (upY - downY);
  };
};

// 转化坐标，放大/缩小后坐标会有偏移
const getRealPoint = (x, y) => {
  const pointX =
    ((wrap.value.offsetWidth / 2 - x) / canvasScale) * (canvasScale - 1) +
    x -
    translatePointX;
  const pointY =
    ((wrap.value.offsetHeight / 2 - y) / canvasScale) * (canvasScale - 1) +
    y -
    translatePointY;

  return { pointX, pointY };
};

// 画笔模式监听方法
const handleLineMode = (downX, downY, offsetX, offsetY) => {
  const { pointX, pointY } = getRealPoint(downX, downY);

  ctx.beginPath();

  ctx.moveTo(pointX, pointY);

  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
    // 因为wrap设置了相对定位，获取的pageX/Y是以wrpa为基准的，要减去wrap左边和上边的偏移量
    const moveX = e.pageX - offsetX;
    const moveY = e.pageY - offsetY;
    const { pointX, pointY } = getRealPoint(moveX, moveY);
    if (MouseState.value == "ERASER_MODE") {
      ctx.clearRect(
        pointX - eraserWidth.value / 2,
        pointY - eraserWidth.value,
        eraserWidth.value,
        eraserWidth.value
      );
    } else {
      ctx.lineCap = "round";
      ctx.lineTo(pointX, pointY);
      ctx.stroke();
    }
  };

  canvas.value.onmouseup = () => {
    ctx.closePath();
    canvas.value.onmousemove = null;
    canvas.value.onmouseup = null;
    upDataCanvas();
  };
};

// 形状模式监听方法，触发对应形状的方法
const handleShapeMode = (downX, downY, offsetX, offsetY) => {
  switch (ShapeState.value) {
    case "LINE_MODE":
      handleShapeLineMode(downX, downY, offsetX, offsetY);
      break;
    case "RECTANGLE_MODE":
      handleRectangleMode(downX, downY, offsetX, offsetY);
      break;
    case "ROUND_MODE":
      handleRoundMode(downX, downY, offsetX, offsetY);
      break;
    default:
      break;
  }
};

// 线段方法
const handleShapeLineMode = (downX, downY, offsetX, offsetY) => {
  // 保存初始画布状态
  upDataCanvas();

  const { pointX: startX, pointY: startY } = getRealPoint(downX, downY);
  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
    // 撤销上次画的线段，mounsemove会多次触发，我们只取最后一次
    revokeDraw();
    const moveX = e.pageX - offsetX;
    const moveY = e.pageY - offsetY;
    const { pointX: endX, pointY: endY } = getRealPoint(moveX, moveY);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
    upDataCanvas();
  };

  canvas.value.onmouseup = () => {
    canvas.value.onmousemove = null;
    canvas.value.onmouseup = null;
  };
};

// 矩形方法
const handleRectangleMode = (downX, downY, offsetX, offsetY) => {
  upDataCanvas();

  const { pointX: startX, pointY: startY } = getRealPoint(downX, downY);

  document.onkeydown = (event) => {
    if (event.key == "Shift") {
      shiftDown = true;
    }
  };

  document.onkeyup = () => {
    shiftDown = false;
  };

  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
    revokeDraw();
    const moveX = e.pageX - offsetX;
    const moveY = e.pageY - offsetY;
    const { pointX: endX, pointY: endY } = getRealPoint(moveX, moveY);

    const rectangleX = startX <= endX ? startX : endX;
    const rectangleY = startY <= endY ? startY : endY;

    if (shiftDown) {
      const squaerWidth =
        Math.abs(endX - startX) < Math.abs(endY - startY)
          ? Math.abs(endX - startX)
          : Math.abs(endY - startY);
      if (endX < startX) {
        if (endY < startY)
          ctx.strokeRect(startX, startY, -squaerWidth, -squaerWidth);
        else ctx.strokeRect(startX, startY, -squaerWidth, squaerWidth);
      } else ctx.strokeRect(rectangleX, rectangleY, squaerWidth, squaerWidth);
    } else {
      const rectangleWidth = Math.abs(endX - startX);
      const rectangleHeight = Math.abs(endY - startY);
      ctx.strokeRect(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
    }
    upDataCanvas();
  };

  canvas.value.onmouseup = () => {
    canvas.value.onmousemove = null;
    canvas.value.onmouseup = null;
  };
};

// 圆形方法
const handleRoundMode = (downX, downY, offsetX, offsetY) => {
  upDataCanvas();

  const { pointX: startX, pointY: startY } = getRealPoint(downX, downY);
  document.onkeydown = (event) => {
    if (event.key == "Shift") {
      shiftDown = true;
    }
  };

  document.onkeyup = () => {
    shiftDown = false;
  };

  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
    revokeDraw();
    const moveX = e.pageX - offsetX;
    const moveY = e.pageY - offsetY;
    const { pointX: endX, pointY: endY } = getRealPoint(moveX, moveY);

    ctx.beginPath();

    const centerX = startX + (endX - startX) / 2;
    const centerY = startY + (endY - startY) / 2;

    if (shiftDown) {
      const radius =
        Math.abs(endX - startX) < Math.abs(endY - startY)
          ? Math.abs(endX - startX) / 2
          : Math.abs(endY - startY) / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    } else {
      const LongAxis = Math.abs(endX - startX) / 2;
      const ShortAxis = Math.abs(endY - startY) / 2;
      ctx.ellipse(centerX, centerY, LongAxis, ShortAxis, 0, 0, 2 * Math.PI);
    }
    ctx.stroke();
    upDataCanvas();
  };

  canvas.value.onmouseup = () => {
    canvas.value.onmousemove = null;
    canvas.value.onmouseup = null;
  };
};

// 更新画布状态
const upDataCanvas = () => {
  const canvasData = ctx.getImageData(
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  if (currentCanvas.value < canvasHistory.length - 1) {
    canvasHistory = canvasHistory.slice(0, currentCanvas.value + 1);
  }
  canvasHistory.push(canvasData);
  currentCanvas.value += 1;
};

// 撤销方法
const revokeDraw = () => {
  if (currentCanvas.value > 0) {
    currentCanvas.value--;
    const canvasData = canvasHistory[currentCanvas.value];
    setCanvas(canvasData);
  }
};

// 恢复方法
const restoreDraw = () => {
  if (currentCanvas.value < canvasHistory.length - 1) {
    currentCanvas.value++;
    const canvasData = canvasHistory[currentCanvas.value];
    setCanvas(canvasData);
  }
};

// 重置画布方法
const resetDraw = () => {
  currentCanvas.value = 0;
  canvasHistory = canvasHistory.slice(0, 1);
  const canvasData = canvasHistory[0];
  canvasScale = 1;
  translatePointX = 0;
  translatePointY = 0;
  fillStartPointX = 0;
  fillStartPointY = 0;
  scaleControl.value = 50;
  setcanvasScale();
  setCanvas(canvasData);
};

// 存储画布状态
const setCanvas = (canvasData) => {
  ctx.putImageData(canvasData, 0, 0);
};

// 将画布导出为图片
const saveImage = () => {
  // 将主画布和背景画布内容合并
  const px = imgCtx.getImageData(
    0,
    0,
    imgCanvas.value.width,
    imgCanvas.value.width
  );
  saveCtx.putImageData(px, 0, 0);
  saveCtx.drawImage(
    canvas.value,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );

  var image = new Image();
  image.src = saveCanvas.value.toDataURL("image/png");
  var url = image.src.replace(
    /^data:image\/[^;]/,
    "data:application/octet-stream"
  );
  downFile(url, "test.png");
};
</script>
<style scoped>
/* * {
  margin: 0;
  padding: 0;
} */

img {
  text-align: center;
  padding: 2px;
}

.main-box {
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  background-color: rgb(248, 248, 248);
}

.top {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: rgb(238, 244, 249);
}

.draw {
  width: 100%;
  height: calc(100% - 50px);
  box-sizing: border-box;
  padding: 50px;
  display: flex;
  /* justify-content: space-between; */
}

.control-box {
  min-width: 300px;
  height: 650px;
  border: 1.5px skyblue solid;
  background-color: #fff;
  border-radius: 20px;
  margin-right: 50px;
  box-sizing: border-box;
  padding: 20px;
}

.draw-box {
  width: 1150px;
  height: 650px;
  border: 1.5px skyblue solid;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

#canvas {
  position: relative;
  z-index: 1;
}

#imgCanvas {
  position: absolute;
  left: 0;
  top: 0;
  /* z-index: -1; */
}

#saveCanvas {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}

.chose {
  border: 1.5px solid rgb(0, 62, 146);
  border-radius: 5px;
}

.chose-color-border {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  padding: 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 0;
  position: relative;
  cursor: pointer;
  margin-right: 10px;
}

.chose-color {
  position: relative;
  display: block;
  box-sizing: border-box;
  border: 1px solid #909399;
  border-radius: 2px;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
