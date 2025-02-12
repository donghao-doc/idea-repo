<script setup lang="ts">
import { onMounted } from 'vue'
import * as PIXI from 'pixi.js'

onMounted(() => {
  console.log('PIXI:', PIXI)
})
</script>

<template>
  <div>
    <div id="scratch-container"></div>
  </div>
</template>
