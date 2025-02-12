<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

const BG_URL =
  'https://morefun-active.oss-cn-beijing.aliyuncs.com/starbucks-super-2021/details/bg_cupPaste.png?t=001'

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

  // 加载并绘制背景图片
  PIXI.Assets.load(BG_URL).then((texture) => {
    if (!app) return

    const bgSprite = new PIXI.Sprite(texture)

    // 设置图片高度与舞台一致
    const scale = height / bgSprite.height
    bgSprite.height = height
    bgSprite.width = bgSprite.width * scale

    // 水平居中
    bgSprite.x = (width - bgSprite.width) / 2

    app.stage.addChild(bgSprite)
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
  <div>
    <div ref="containerRef"></div>
  </div>
</template>
