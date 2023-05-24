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
        <div class="draw-operate" style="margin-bottom: 15px">
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
import getImageByPath from "../utils/getImageByPath";
import downFile from "../utils/downFile";

const canvas = ref(null);
const imgCanvas = ref(null);
const saveCanvas = ref(null);
const wrap = ref(null);
const currentCanvas = ref(0);
const scaleControl = ref(50);
const lineWidth = ref(3);
const lineColor = ref("#000");
const eraserWidth = ref(16);
const MouseState = ref("MOVE_MODE");
const ShapeState = ref("");

var ctx;
var imgCtx;
var saveCtx;

var canvasHistory = [];
var canvasScale = 1;

var translatePointXRef = 0;
var translatePointYRef = 0;

var fillStartPointXRef = 0;
var fillStartPointYRef = 0;

var shiftDown = false;

onMounted(async () => {
  ctx = canvas.value.getContext("2d");
  imgCtx = imgCanvas.value.getContext("2d");
  saveCtx = saveCanvas.value.getContext("2d");

  ctx.fillStyle = "rgba(255, 255, 255, 0)";

  const canvasData = ctx.getImageData(
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  canvasHistory = [];
  canvasHistory.push(canvasData);
  currentCanvas.value = 0;

  canvas.value.style.transformOrigin = `${wrap.value.offsetWidth / 2}px ${
    wrap.value.offsetHeight / 2
  }px`;

  imgCanvas.value.style.transformOrigin = `${wrap.value.offsetWidth / 2}px ${
    wrap.value.offsetHeight / 2
  }px`;

  canvas.value.style.transform = "";
  imgCanvas.value.style.transform = "";

  handleCanvs();
  changeMouseState("MOVE_MODE");
});

const uploadImage = () => {
  const uploadFile = document.getElementById("upload-file");
  const file = uploadFile.files[0];
  const image = new Image();
  image.src = window.URL.createObjectURL(file);

  image.onload = () => {
    // ctx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
    imgCtx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
    // saveCtx.drawImage(image, 0, 0, canvas.value.width, canvas.value.height);
    upDataCanvas();
  };
};

const handleCanvs = () => {
  wrap.value.onmousedown = null;
  wrap.value.onmousedown = function (event) {
    const downX = event.pageX;
    const downY = event.pageY;

    ctx.strokeStyle = lineColor.value;
    ctx.lineWidth = lineWidth.value;

    switch (MouseState.value) {
      case "MOVE_MODE":
        handleMoveMode(downX, downY);
        break;
      case "LINE_MODE":
        handleLineMode(downX, downY);
        break;
      case "ERASER_MODE":
        handleLineMode(downX, downY);
        break;
      case "SHAPE_MODE":
        handleShapeMode(downX, downY);
        break;
      default:
        break;
    }
  };

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
      setcanvasScale(newScale);
    }
  };
};

watch(scaleControl, (value) => {
  canvasScale = 2 * (value / 100) < 0.1 ? 0.1 : 2 * (value / 100);
  setcanvasScale();
});

const scaleFormat = (value) => {
  return 2 * (value / 100) < 0.1 ? 0.1 : 2 * (value / 100);
};

const setcanvasScale = () => {
  canvas.value &&
    (canvas.value.style.transform = `scale(${canvasScale}, ${canvasScale}) translate(${translatePointXRef}px, ${translatePointYRef}px)`);
  imgCanvas.value &&
    (imgCanvas.value.style.transform = `scale(${canvasScale}, ${canvasScale}) translate(${translatePointXRef}px, ${translatePointYRef}px)`);
};

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
      )}) 6 26, pointer`;
      break;
    default:
      canvas.style.cursor = "default";
      wrap.value.style.cursor = "default";
      break;
  }
};

const handleMoveMode = (downX, downY) => {
  const fillStartPointX = fillStartPointXRef;
  const fillStartPointY = fillStartPointYRef;

  wrap.value.onmousemove = (event) => {
    const moveX = event.pageX;
    const moveY = event.pageY;

    translatePointXRef = fillStartPointX + (moveX - downX);
    translatePointYRef = fillStartPointY + (moveY - downY);

    setcanvasScale();
  };

  wrap.value.onmouseup = (event) => {
    const upX = event.pageX;
    const upY = event.pageY;

    wrap.value.onmousemove = null;
    wrap.value.onmouseup = null;

    fillStartPointXRef = fillStartPointX + (upX - downX);
    fillStartPointYRef = fillStartPointY + (upY - downY);
  };
};

const getRealPoint = (x, y) => {
  const pointX =
    ((wrap.value.offsetWidth / 2 - x) / canvasScale) * (canvasScale - 1) +
    x -
    translatePointXRef;
  const pointY =
    ((wrap.value.offsetHeight / 2 - y) / canvasScale) * (canvasScale - 1) +
    y -
    translatePointYRef;

  return { pointX, pointY };
};

const handleLineMode = (downX, downY) => {
  const offsetX = parseInt(wrap.value.offsetLeft);
  const offsetY = parseInt(wrap.value.offsetTop);

  downX = downX - offsetX;
  downY = downY - offsetY;

  const { pointX, pointY } = getRealPoint(downX, downY);

  ctx.globalCompositeOperation = "source-over";
  ctx.beginPath();

  ctx.moveTo(pointX, pointY);

  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
    const moveX = e.pageX - offsetX;
    const moveY = e.pageY - offsetY;
    const { pointX, pointY } = getRealPoint(moveX, moveY);
    if (MouseState.value == "ERASER_MODE") {
      // let pxs = imgCtx.getImageData(
      //   pointX - eraserWidth.value / 2,
      //   pointY - eraserWidth.value,
      //   eraserWidth.value,
      //   eraserWidth.value
      // );
      // ctx.putImageData(
      //   pxs,
      //   pointX - eraserWidth.value / 2,
      //   pointY - eraserWidth.value
      // );
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

const handleShapeMode = (downX, downY) => {
  switch (ShapeState.value) {
    case "LINE_MODE":
      handleShapeLineMode(downX, downY);
      break;
    case "RECTANGLE_MODE":
      handleRectangleMode(downX, downY);
      break;
    case "ROUND_MODE":
      handleRoundMode(downX, downY);
      break;
    default:
      break;
  }
};

const handleShapeLineMode = (downX, downY) => {
  upDataCanvas();
  const offsetX = parseInt(wrap.value.offsetLeft);
  const offsetY = parseInt(wrap.value.offsetTop);

  downX = downX - offsetX;
  downY = downY - offsetY;

  const { pointX: startX, pointY: startY } = getRealPoint(downX, downY);

  canvas.value.onmousemove = null;
  canvas.value.onmousemove = (e) => {
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

const handleRectangleMode = (downX, downY) => {
  upDataCanvas();
  const offsetX = parseInt(wrap.value.offsetLeft);
  const offsetY = parseInt(wrap.value.offsetTop);

  downX = downX - offsetX;
  downY = downY - offsetY;

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

const handleRoundMode = (downX, downY) => {
  upDataCanvas();
  const offsetX = parseInt(wrap.value.offsetLeft);
  const offsetY = parseInt(wrap.value.offsetTop);

  downX = downX - offsetX;
  downY = downY - offsetY;

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

const revokeDraw = () => {
  if (currentCanvas.value > 0) {
    currentCanvas.value--;
    const canvasData = canvasHistory[currentCanvas.value];
    setCanvas(canvasData);
  }
};

const restoreDraw = () => {
  if (currentCanvas.value < canvasHistory.length - 1) {
    currentCanvas.value++;
    const canvasData = canvasHistory[currentCanvas.value];
    setCanvas(canvasData);
  }
};

const resetDraw = () => {
  currentCanvas.value = 0;
  canvasHistory = canvasHistory.slice(0, 1);
  const canvasData = canvasHistory[0];
  canvasScale = 1;
  translatePointXRef = 0;
  translatePointYRef = 0;
  fillStartPointXRef = 0;
  fillStartPointYRef = 0;
  scaleControl.value = 50;
  setcanvasScale();
  setCanvas(canvasData);
  document.getElementById("upload-file").files = [];
};

const setCanvas = (canvasData) => {
  ctx.putImageData(canvasData, 0, 0);
};

const saveImage = () => {
  const px = imgCtx.getImageData(
    0,
    0,
    imgCanvas.value.width,
    imgCanvas.value.width
  );
  saveCtx.putImageData(px, 0, 0);
  saveCtx.drawImage(canvas.value, 0, 0, canvas.value.width, canvas.value.height);

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
