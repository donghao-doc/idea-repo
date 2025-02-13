<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

const BG_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/details/bg_cupPaste.png?t=001'
const TEXT_LINE_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/details/textLine.png?t=002'

let app: PIXI.Application | null = null
const containerRef = ref<HTMLDivElement | null>(null)

// 计算响应式高度
const calculateHeight = (width: number) => {
  const ratio = 250 / 375 // 原始高宽比
  return Math.round(width * ratio)
}

// 计算响应式字号
const calculateFontSize = (stageWidth: number) => {
  const baseWidth = 375 // 基准宽度
  const baseFontSize = 16 // 基准字号
  return Math.round((stageWidth / baseWidth) * baseFontSize)
}

// 绘制背景
const drawBackground = (
  texture: PIXI.Texture,
  stageWidth: number,
  stageHeight: number,
): PIXI.Sprite => {
  if (!app) throw new Error('PIXI Application is not initialized')

  const bgSprite = new PIXI.Sprite(texture)
  const scale = stageHeight / bgSprite.height
  bgSprite.height = stageHeight
  bgSprite.width = bgSprite.width * scale
  bgSprite.x = (stageWidth - bgSprite.width) / 2
  app.stage.addChild(bgSprite)

  return bgSprite
}

// 绘制文本
const drawText = (textLineSprite: PIXI.Sprite, pixiApp: PIXI.Application, content: string) => {
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

  // 添加到舞台
  pixiApp.stage.addChild(text)
}

// 绘制文本线
const drawTextLine = (
  texture: PIXI.Texture,
  bgSprite: PIXI.Sprite,
  stageHeight: number,
): PIXI.Sprite => {
  if (!app) throw new Error('PIXI Application is not initialized')

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

  // 添加到舞台
  app.stage.addChild(textLineSprite)

  return textLineSprite
}

onMounted(() => {
  const width = window.innerWidth
  const height = calculateHeight(width)

  // 创建 PIXI 应用
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
  Promise.all([PIXI.Assets.load(BG_URL), PIXI.Assets.load(TEXT_LINE_URL)]).then(
    ([bgTexture, textLineTexture]) => {
      if (!app) return

      // 绘制背景
      const bgSprite = drawBackground(bgTexture, width, height)

      // 绘制文本线和文本
      const textLineSprite = drawTextLine(textLineTexture, bgSprite, height)
      drawText(textLineSprite, app, '恭喜你获得星巴克买一送一优惠券')
    },
  )
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
  <div>
    <div ref="containerRef"></div>
  </div>
</template>
