<template>
  <div class="svg-icon-example">
    <h3>SVG图标使用示例</h3>

    <!-- 基本使用方式 -->
    <div class="example-item">
      <h4>基本使用</h4>
      <inline-svg :src="ChatIcon" width="48" height="48" />
    </div>

    <!-- 带颜色变化的使用方式 -->
    <div class="example-item">
      <h4>自定义颜色</h4>
      <inline-svg :src="ChatIcon" width="48" height="48" class="blue-icon" />
    </div>

    <!-- 带动态大小的使用方式 -->
    <div class="example-item">
      <h4>动态大小</h4>
      <inline-svg :src="ChatIcon" :width="iconSize" :height="iconSize" class="green-icon" />
      <div class="size-control">
        <button @click="decreaseSize">缩小</button>
        <span>当前大小: {{ iconSize }}px</span>
        <button @click="increaseSize">放大</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChatIcon from './chat-icon.svg';

// 响应式状态
const iconSize = ref(48);

// 方法定义
const increaseSize = () => {
  iconSize.value = Math.min(iconSize.value + 10, 100);
};

const decreaseSize = () => {
  iconSize.value = Math.max(iconSize.value - 10, 20);
};

// 生命周期钩子
onMounted(() => {
  console.log('SVG Icon Example mounted');
  console.log(ChatIcon);
});
</script>

<style scoped>
.svg-icon-example {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
}

h3 {
  margin-top: 0;
  color: #333;
}

h4 {
  color: #666;
  margin-bottom: 10px;
}

.example-item {
  margin-bottom: 30px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.blue-icon {
  color: #1890ff;
}

.green-icon {
  color: #52c41a;
}

.size-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 5px 10px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #40a9ff;
}

span {
  min-width: 120px;
}
</style>
