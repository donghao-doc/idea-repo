<script setup lang="ts">
import { ref } from 'vue'
import * as PIXI from 'pixi.js'

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

// 加载进度
const progress = ref(0)
// 需要加载的资源
const assets = [
  ...poolImgArr,
  ...coinImgArr,
  ...putCoinImgArr,
  'https://static.chagee.com/cdn-tools-transfer/user-medal-system/font/SourceHanSerifCN-Medium.woff',
]
// 生成资源对象列表
const assetsObjList = assets.map((item) => ({ alias: item, src: item }))

// 加载资源
PIXI.Assets.load(assetsObjList, (progressValue) => {
  console.log('加载进度', progressValue)
  progress.value = progressValue
})
</script>

<template>
  <div class="loader-loading-page">
    <div class="progress-box">
      <div :style="{ width: `${(progress * 100).toFixed(2)}%` }" class="progress-bar"></div>
    </div>
    <span class="progress-text">{{ progress >= 1 ? '加载完成' : '加载中...' }}</span>
  </div>
</template>

<style scoped>
@font-face {
  font-family: Source Han Serif SC;
  src: url('https://static.chagee.com/cdn-tools-transfer/user-medal-system/font/SourceHanSerifCN-Medium.woff');
  font-display: swap;
  font-weight: 400;
}

.loader-loading-page {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.progress-box {
  width: 80%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-bar {
  width: 0%;
  height: 100%;
  background-color: #007bff;
}

.progress-text {
  font-family: Source Han Serif SC;
  font-size: 16px;
  color: #000;
}
</style>
