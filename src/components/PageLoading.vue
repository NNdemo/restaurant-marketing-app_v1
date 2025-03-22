<template>
  <div class="page-loading">
    <div class="loading-spinner">
      <van-loading color="var(--primary-color)" size="32px" />
    </div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Loading...'
  }
});
</script>

<style scoped>
.page-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
}

.loading-spinner {
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}
</style> 