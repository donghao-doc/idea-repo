<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

const BG_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/details/bg_cupPaste.png?t=001'
const TEXT_LINE_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/details/textLine.png?t=002'
const MASK_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/assist/mask.png?t=002'
const textContent = '人有悲欢离合，月有阴晴圆缺，此事古难全'

let app: PIXI.Application | null = null
const containerRef = ref<HTMLDivElement | null>(null)

// 计算舞台响应式高度
const calculateHeight = (width: number) => {
  const ratio = 250 / 375 // 原始高宽比（设计稿画布高度/设计稿画布宽度），假设设计稿是 375px 宽
  return Math.round(width * ratio)
}

// 计算响应式字号
const calculateFontSize = (stageWidth: number) => {
  const baseWidth = 375 // 基准宽度，假设设计稿是 375px 宽
  const baseFontSize = 16 // 基准字号
  return Math.round((stageWidth / baseWidth) * baseFontSize)
}

// 绘制背景/遮罩
const drawBgOrMask = (
  texture: PIXI.Texture,
  stageWidth: number,
  stageHeight: number,
): PIXI.Sprite => {
  const bgOrMaskSprite = new PIXI.Sprite(texture)
  const scale = stageHeight / bgOrMaskSprite.height

  bgOrMaskSprite.height = stageHeight
  bgOrMaskSprite.width = bgOrMaskSprite.width * scale
  bgOrMaskSprite.x = (stageWidth - bgOrMaskSprite.width) / 2

  return bgOrMaskSprite
}

// 绘制文本线
const drawTextLine = (
  texture: PIXI.Texture,
  bgSprite: PIXI.Sprite,
  stageHeight: number,
): PIXI.Sprite => {
  const textLineSprite = new PIXI.Sprite(texture)

  // 计算目标宽度（背景宽度的70%）
  const textLineWidth = bgSprite.width * 0.7

  // 计算缩放比例
  const textLineScale = textLineWidth / textLineSprite.width

  // 等比例缩放文本线
  textLineSprite.scale.set(textLineScale)

  // 将文本线放置在背景中间
  textLineSprite.x = bgSprite.x + (bgSprite.width - textLineSprite.width) / 2
  textLineSprite.y = stageHeight * 0.5

  return textLineSprite
}

// 绘制文本
const drawText = (
  textLineSprite: PIXI.Sprite,
  pixiApp: PIXI.Application,
  content: string,
): PIXI.Text => {
  // 计算响应式字号
  const fontSize = calculateFontSize(pixiApp.screen.width)

  // 创建文本样式
  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize,
    fill: '#000000',
    align: 'center',
    wordWrap: true, // 启用自动换行
    wordWrapWidth: textLineSprite.width, // 设置换行宽度为文本线宽度
    breakWords: true, // 允许在单词中间换行（对中文很有用）
    lineHeight: Math.round(fontSize * 2.2), // 设置行高为字号的2.2倍
  })

  // 创建文本精灵
  const text = new PIXI.Text(content, textStyle)

  // 设置文本位置
  text.anchor.set(0.5, 0) // 设置锚点为中心，便于居中对齐
  text.x = textLineSprite.x + textLineSprite.width / 2
  text.y = textLineSprite.y - textLineSprite.height / 1.1

  return text
}

// 根据绘制圆的数量，判断是否结束
let circleCount = 0
const scratchEnd = () => {
  circleCount += 1
  if (circleCount >= 200) {
    window.alert('已刮开')
  }
}

onMounted(() => {
  const width = window.innerWidth
  const height = calculateHeight(width)

  // 创建 PIXI 应用（舞台）
  app = new PIXI.Application({
    width,
    height,
    backgroundColor: 0xffffff,
    antialias: true,
    resolution: window.devicePixelRatio || 1, // 设置分辨率为设备像素比
    autoDensity: true, // 自动调整 CSS 样式以匹配分辨率
  })

  // 将 PIXI 画布添加到容器中
  if (containerRef.value) {
    containerRef.value.appendChild(app.view as HTMLCanvasElement)
  }

  // 加载并绘制背景图片和文本线
  Promise.all([
    PIXI.Assets.load(BG_URL),
    PIXI.Assets.load(TEXT_LINE_URL),
    PIXI.Assets.load(MASK_URL),
  ]).then(([bgTexture, textLineTexture, maskTexture]) => {
    if (!app) throw new Error('PIXI Application is not initialized')

    // 创建遮罩、背景、文本线、文本精灵
    const maskSprite = drawBgOrMask(maskTexture, width, height)
    const bgSprite = drawBgOrMask(bgTexture, width, height)
    const textLineSprite = drawTextLine(textLineTexture, bgSprite, height)
    const textSprite = drawText(textLineSprite, app, textContent)

    // 创建遮罩容器、普通容器
    const maskContainer = new PIXI.Container()
    const container = new PIXI.Container()

    // 往容器中添加精灵
    maskContainer.addChild(maskSprite)
    container.addChild(bgSprite)
    container.addChild(textLineSprite)
    container.addChild(textSprite)

    // 将容器添加到舞台
    app.stage.addChild(maskContainer)
    app.stage.addChild(container)

    // 创建图形，用于实现擦除效果
    const scratchGraphics = new PIXI.Graphics()
    // scratchGraphics.beginFill(0x000000, 0.5) // 设置填充颜色和透明度
    // scratchGraphics.drawRect(0, 0, width, height) // 绘制矩形
    // scratchGraphics.endFill() // 结束填充
    app.stage.addChild(scratchGraphics)

    // 设置容器遮罩
    container.mask = scratchGraphics

    // 设置遮罩容器事件
    maskContainer.eventMode = 'dynamic' // 设置事件模式为动态
    maskContainer.on('touchstart', () => {
      scratchGraphics.beginFill(0xde3249, 1)
    })
    maskContainer.on('touchmove', (event) => {
      const { x, y } = event.getLocalPosition(maskContainer)
      scratchGraphics.drawCircle(x, y, 20)
      scratchEnd()
    })
    maskContainer.on('touchend', () => {
      scratchGraphics.endFill()
    })
    maskContainer.on('touchendoutside', () => {
      scratchGraphics.endFill()
    })
    maskContainer.on('touchcancel', () => {
      scratchGraphics.endFill()
    })
  })
})

// 组件卸载时清理
onUnmounted(() => {
  if (app) {
    app.destroy(true)
    app = null
  }
})
</script>

<template>
  <div class="scratch-card-page">
    <div ref="containerRef"></div>
  </div>
</template>

<style scoped>
.scratch-card-page {
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
}
</style>
