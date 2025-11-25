<template>
  <div class="grid grid-cols-2 h-full">
    <OrganizationDetailDeptList @dept-selected="handleDepartmentSelected" />
    <OrganizationDetailUserList :current-department="currentDepartment" @user-selected="handleUserSelected" />

    <!-- 使用el-drawer包裹UserDetailView组件 -->
    <el-drawer v-model="drawerVisible" size="40%" @closed="handleDrawerClosed">
      <UserDetailView v-if="currentUser" :user="currentUser" />
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OrganizationDetailDeptList from './OrganizationDetailDeptList.vue';
import OrganizationDetailUserList from './OrganizationDetailUserList.vue';
import UserDetailView from './UserDetailView.vue';
import { ElDrawer } from 'element-plus';

// 添加当前选中部门状态
const currentDepartment = ref(null);
// 添加当前选中用户状态
const currentUser = ref(null);
// 添加抽屉显示状态
const drawerVisible = ref(false);

// 处理部门选中事件
function handleDepartmentSelected(department) {
  currentDepartment.value = department;
}

// 处理用户选中事件
function handleUserSelected(user) {
  currentUser.value = user;
  // 选中用户时自动显示抽屉
  drawerVisible.value = true;
}

// 处理抽屉关闭事件
function handleDrawerClosed() {
  drawerVisible.value = false;
  // 关闭抽屉时清空选中用户
  currentUser.value = null;
}
</script>

<style lang="scss" scoped></style>
