<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToScratchCard = () => {
  router.push('/scratch-card')
}
</script>

<template>
  <div class="home">
    <button @click="goToScratchCard" class="scratch-btn">刮刮卡</button>
  </div>
</template>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.scratch-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.scratch-btn:hover {
  background-color: #3aa876;
}
</style>
