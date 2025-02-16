<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as PIXI from 'pixi.js'

const pixiCanvas = ref<HTMLDivElement>()

// 许愿池序列帧图片
const poolImgArr: string[] = []
for (let i = 1; i <= 20; i++) {
  poolImgArr.push(
    `https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/animation/pool/pool${i}.jpg`,
  )
}

// 硬币序列帧图片
const coinImgArr: string[] = []
for (let i = 1; i <= 80; i++) {
  coinImgArr.push(
    `https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/animation/icon/icon${i}.png?v=1.0`,
  )
}

onMounted(() => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    antialias: true,
    resolution: window.devicePixelRatio || 1, // 设置分辨率为设备像素比
    autoDensity: true, // 自动调整 CSS 样式以匹配分辨率
  })
  pixiCanvas.value?.appendChild(app.view as HTMLCanvasElement)

  // 许愿池动画
  const poolTextures = getTexture(poolImgArr)
  const aniSprite = createAnimationSprite(poolTextures, 0.16)
  app.stage.addChild(aniSprite)
  aniSprite.play()

  // 硬币动画
  const coinTextures = getTexture(coinImgArr)
  const coinSprite = createAnimationSprite(coinTextures, 0.2)
  app.stage.addChild(coinSprite)
  coinSprite.play()
  coinSprite.x = app.screen.width - coinSprite.width
  coinSprite.y = app.screen.height * 0.2
})

// 根据序列帧图片链接获取纹理
function getTexture(urlArr: string[]) {
  return urlArr.map((url) => PIXI.Texture.from(url))
}

// 创建动画精灵
function createAnimationSprite(textures: PIXI.Texture[], speed = 0.1, scale = 0.5) {
  const aniSprite = new PIXI.AnimatedSprite(textures)

  aniSprite.loop = true
  aniSprite.animationSpeed = speed
  aniSprite.scale.set(scale)

  return aniSprite
}
</script>

<template>
  <div class="frame-animation-page">
    <div ref="pixiCanvas" class="pixi-canvas"></div>
  </div>
</template>

<style scoped>
.frame-animation-page {
  width: 100vw;
  height: 100vh;
}
</style>
