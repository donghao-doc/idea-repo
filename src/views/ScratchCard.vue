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
      const bgSprite = new PIXI.Sprite(bgTexture)
      const scale = height / bgSprite.height
      bgSprite.height = height
      bgSprite.width = bgSprite.width * scale
      bgSprite.x = (width - bgSprite.width) / 2
      app.stage.addChild(bgSprite)

      // 绘制文本线
      const textLineSprite = new PIXI.Sprite(textLineTexture)

      // 计算目标宽度（背景宽度的70%）
      const textLineWidth = bgSprite.width * 0.7

      // 计算缩放比例
      const textLineScale = textLineWidth / textLineSprite.width

      // 等比例缩放文本线
      textLineSprite.scale.set(textLineScale)

      // 将文本线放置在背景中间
      textLineSprite.x = bgSprite.x + (bgSprite.width - textLineSprite.width) / 2
      textLineSprite.y = height * 0.5
      app.stage.addChild(textLineSprite)
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
