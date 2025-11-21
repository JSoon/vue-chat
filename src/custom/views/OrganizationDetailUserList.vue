<template>
  <div class="w-[300px] h-full overflow-auto border-r border-gray-200">
    <div
      class="h-[66px] leading-[66px] px-4 text-lg font-bold border-b border-gray-200 sticky top-0 bg-white z-10 truncate"
    >
      {{ currentDepartment ? currentDepartment.deptName : '请选择部门查看成员' }}
    </div>
    <el-skeleton v-if="loading" class="p-4" animated style="--el-skeleton-circle-size: 60px">
      <template #template>
        <div class="flex flex-col gap-2">
          <el-skeleton-item variant="circle" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
          <el-skeleton-item variant="text" style="width: 100%" />
          <el-skeleton-item variant="text" style="width: 70%" />
        </div>
      </template>
    </el-skeleton>
    <div v-else-if="users.length">
      <div
        v-for="user in users"
        :key="user.userId"
        class="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors"
        @click="handleUserClick(user)"
      >
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
          {{ user.nickName ? user.nickName.charAt(0) : '?' }}
        </div>
        <div class="flex-1 flex justify-between w-full">
          <el-text>{{ user.nickName || '未知用户' }}</el-text>
          <el-text v-if="user.userName" type="info">{{ user.userName }}</el-text>
        </div>
      </div>
    </div>
    <div v-else-if="currentDepartment" class="text-center text-gray-400 py-10">当前部门暂无成员</div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { ElSkeleton, ElSkeletonItem, ElText } from 'element-plus';
import { fetchDepartmentUsers } from '../api/user';
import wfc from '../../wfc/client/wfc';

// 接收父组件传递的当前部门
const props = defineProps({
  currentDepartment: {
    type: Object,
    default: null,
  },
});

// 用户列表和加载状态
const users = ref([]);
const loading = ref(false);

// 查询部门成员
async function queryDepartmentMembers(deptId) {
  if (!deptId) {
    users.value = [];
    return;
  }

  loading.value = true;
  try {
    const { data } = await fetchDepartmentUsers({
      deptId,
      queryGrandson: true, // 仅查询当前部门成员
    });
    users.value = data || [];
  } catch (error) {
    console.error('查询部门成员失败:', error);
    users.value = [];
  } finally {
    loading.value = false;
  }
}

// 处理用户点击事件
function handleUserClick(user) {
  // 可以添加点击用户后的逻辑，例如跳转到用户详情页
  console.log('点击用户:', user);
  wfc.getUserInfoEx(
    user.userName,
    true,
    (userInfo) => {
      console.log('用户信息:', userInfo);
    },
    (error) => {
      console.error('获取用户信息失败:', error);
    }
  );
}

// 监听当前部门变化
watchEffect(() => {
  queryDepartmentMembers(props.currentDepartment?.deptId);
});
</script>

<style lang="scss" scoped>
// 可以根据需要添加样式
</style>
