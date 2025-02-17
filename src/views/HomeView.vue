<template>
  <div class="home-page">
    <button @click="$router.push('/scratch-card')">刮刮卡</button>
    <button @click="$router.push('/frame-animation')">序列帧动画</button>
    <button @click="$router.push('/loader-loading')">Loader Loading</button>
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.home-page > button {
  width: 50%;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-page > button:hover {
  background-color: #3aa876;
}
</style>
