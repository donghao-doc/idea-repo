<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as PIXI from 'pixi.js'

let app: PIXI.Application | null = null
const containerRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // 创建 PIXI 应用
  app = new PIXI.Application({
    width: window.innerWidth,
    height: 300,
    backgroundColor: 0xffffff,
    antialias: true,
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
