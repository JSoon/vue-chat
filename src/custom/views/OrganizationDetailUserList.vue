<template>
  <div class="h-full overflow-auto border-r border-gray-200">
    <div
      class="h-[66px] leading-[66px] px-4 text-lg font-bold border-b border-gray-200 sticky top-0 bg-white z-10 truncate"
    >
      {{ currentDepartment ? currentDepartment.deptName : '请选择部门查看成员' }}
    </div>
    <el-form
      v-if="currentDepartment"
      :model="searchForm"
      class="p-3 bg-gray-50 border-b border-gray-200 sticky top-[66px] z-10"
    >
      <div class="flex gap-2 items-center mb-2">
        <el-input
          v-model="searchForm.nickName"
          placeholder="搜索成员姓名"
          clearable
          class="flex-1"
          @input="debouncedSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="flex items-center gap-2">
        <el-switch v-model="searchForm.includeSubDepartment" @change="handleSearch" />
        <el-text>包含子部门成员</el-text>
      </div>
    </el-form>
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
    <el-empty v-else-if="currentDepartment" description="当前部门暂无成员" :image-size="64" />
    <el-empty v-else description="请选择部门查看成员" :image-size="64" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElSkeleton, ElSkeletonItem, ElText, ElForm, ElInput, ElSwitch, ElIcon, ElEmpty } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/core';
import { fetchDepartmentUsers } from '../api/user';
import wfc from '../../wfc/client/wfc';

// 接收父组件传递的当前部门
const props = defineProps({
  currentDepartment: {
    type: Object,
    default: null,
  },
});

// 定义事件
const emit = defineEmits(['user-selected']);

// 用户列表和加载状态
const users = ref([]);
const loading = ref(false);

// 搜索表单
const searchForm = ref({
  nickName: '',
  includeSubDepartment: false,
});

// 处理搜索
function handleSearch() {
  queryDepartmentMembers(props.currentDepartment?.deptId);
}

// 创建防抖版本的搜索函数，延迟300毫秒
const debouncedSearch = useDebounceFn(() => {
  handleSearch();
}, 500);

// 重置部门状态（清空用户和搜索表单）
function resetDepartmentState() {
  users.value = [];
  // 仅重置搜索表单的昵称，保持其他搜索条件
  searchForm.value.nickName = '';
}

// 查询部门成员
async function queryDepartmentMembers(deptId) {
  if (!deptId) {
    resetDepartmentState();
    return;
  }

  loading.value = true;
  try {
    const { data } = await fetchDepartmentUsers({
      deptId,
      queryGrandson: searchForm.value.includeSubDepartment, // 不包含子部门时为true，只查询当前部门
      nickName: searchForm.value.nickName, // 搜索用户昵称
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
      // FIXME(SDK BUG): 这个接口有可能回调2次，第一次是本地的，第二次是网络获取的，如果没有变化，第二次就是空的
      if (userInfo.uid) {
        console.log('用户信息:', userInfo);
        emit('user-selected', userInfo);
      }
    },
    (error) => {
      console.error('获取用户信息失败:', error);
      emit('user-selected', null);
    }
  );
}

// 监听部门变化，只在部门ID变化时执行搜索
watch(
  () => props.currentDepartment?.deptId,
  (newDeptId) => {
    resetDepartmentState();
    queryDepartmentMembers(newDeptId);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
// 可以根据需要添加样式
</style>
