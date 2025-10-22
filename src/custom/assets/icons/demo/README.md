# SVG 图标使用指南

本目录用于存放项目中使用的 SVG 图标文件。通过 vue-inline-svg 库，我们可以轻松地在 Vue 组件中使用这些 SVG 图标。

## 使用方法

### 1. 添加 SVG 图标

将你的 SVG 图标文件放在此目录中（`src/custom/assets/icons/`）。

### 2. 在 Vue 组件中使用

在任何 Vue 组件中，你都可以使用`<inline-svg>`组件来导入和使用 SVG 图标：

```vue
<template>
  <div>
    <!-- 基本使用 -->
    <inline-svg src="/src/custom/assets/icons/chat-icon.svg" width="24" height="24" />

    <!-- 自定义颜色 -->
    <inline-svg src="/src/custom/assets/icons/chat-icon.svg" width="24" height="24" class="custom-color" />

    <!-- 动态属性 -->
    <inline-svg :src="iconPath" :width="iconSize" :height="iconSize" @click="handleClick" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconPath: '/src/custom/assets/icons/chat-icon.svg',
      iconSize: 32,
    };
  },
  methods: {
    handleClick() {
      console.log('Icon clicked!');
    },
  },
};
</script>

<style scoped>
.custom-color {
  color: #1890ff; /* 这会改变SVG图标的颜色 */
}
</style>
```

### 3. SVG 图标样式控制

- **颜色控制**: 通过 CSS 的`color`属性可以控制 SVG 图标的颜色（SVG 文件中需要使用`currentColor`作为填充色）
- **大小控制**: 通过`width`和`height`属性控制图标的尺寸
- **动画**: 可以为 SVG 图标添加 CSS 动画效果

## 注意事项

1. 为了更好地控制颜色，建议在 SVG 文件中使用`currentColor`作为填充和描边颜色
2. 确保 SVG 文件不包含内联样式，以免覆盖你在组件中定义的样式
3. 对于复杂的 SVG 图标，可以考虑使用`<symbol>`和`<use>`标签来优化

## 示例

可以参考`SvgIconExample.vue`文件，它演示了各种使用 SVG 图标的方法。
