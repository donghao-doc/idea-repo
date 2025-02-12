<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

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
