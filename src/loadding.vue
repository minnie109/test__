<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <div class="loading">
    <dotlottie-player 
      src="https://lottie.host/984df792-c95f-4a22-815a-77e18c86e9fc/rwimdtMQT2.json" 
      background="transparent" 
      speed="1" 
      style="max-width: 100%; max-height: 100%; width:auto; height: auto;object-fit: cover;transform: scale(1.2);" 
      loop 
      autoplay>
    </dotlottie-player>
  </div>
</template>

<script setup>
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 高度為視窗高度 */
  margin: 0;
  background-color: transparent; /* 背景透明 */
  overflow: hidden; /* 隱藏超出邊界的內容 */
}
</style>