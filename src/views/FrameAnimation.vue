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

// 投币动画序列帧图片
const putCoinImgArr: string[] = []
for (let i = 1; i <= 38; i++) {
  putCoinImgArr.push(
    `https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/animation/coin/coin${i}.png`,
  )
}

onMounted(() => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    antialias: true,
    resolution: window.devicePixelRatio || 1, // 设置分辨率为设备像素比
    autoDensity: true, // 自动调整 CSS 样式以匹配分辨率
  })
  pixiCanvas.value?.appendChild(app.view as HTMLCanvasElement)

  // 许愿池动画
  const poolTextures = getTexture(poolImgArr)
  const aniSprite = createAnimationSprite(poolTextures, 0.16)
  aniSprite.width = app.screen.width
  aniSprite.height = aniSprite.width / (750 / 1334)
  app.stage.addChild(aniSprite)
  aniSprite.play()

  // 硬币动画
  const coinTextures = getTexture(coinImgArr)
  const coinSprite = createAnimationSprite(coinTextures, 0.2)
  app.stage.addChild(coinSprite)
  coinSprite.play()
  coinSprite.x = app.screen.width - coinSprite.width
  coinSprite.y = app.screen.height * 0.2
  coinSprite.eventMode = 'dynamic'
  coinSprite.on('touchstart', () => {
    console.log('touchstart')
  })

  // 创建投币动画精灵
  const putCoinTextures = getTexture(putCoinImgArr)
  const putCoinSprite = createAnimationSprite(putCoinTextures, 0.2, 0.5, false)
  app.stage.addChild(putCoinSprite)
  putCoinSprite.x = app.screen.width / 2 - putCoinSprite.width / 2
  putCoinSprite.visible = false
  putCoinSprite.onComplete = () => {
    console.log('complete')
    putCoinSprite.visible = false
    putCoinSprite.gotoAndStop(0)
  }

  // 创建投币按钮
  const btnSprite = new PIXI.Sprite(
    PIXI.Texture.from(
      'https://morefun-active.oss-cn-beijing.aliyuncs.com/farfetch/draw/btn_draw.png',
    ),
  )
  app.stage.addChild(btnSprite)
  btnSprite.scale.set(0.5)
  btnSprite.x = app.screen.width / 2 - btnSprite.width / 2
  btnSprite.y = aniSprite.height * 0.78
  btnSprite.eventMode = 'dynamic'
  btnSprite.on('touchstart', () => {
    putCoinSprite.visible = true
    putCoinSprite.play()
  })
})

// 根据序列帧图片链接获取纹理
function getTexture(urlArr: string[]) {
  return urlArr.map((url) => PIXI.Texture.from(url))
}

// 创建动画精灵
function createAnimationSprite(textures: PIXI.Texture[], speed = 0.1, scale = 0.5, loop = true) {
  const aniSprite = new PIXI.AnimatedSprite(textures)

  aniSprite.loop = loop
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
