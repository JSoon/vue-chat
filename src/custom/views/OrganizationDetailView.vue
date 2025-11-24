<template>
  <div class="flex">
    <OrganizationDetailDeptList @dept-selected="handleDepartmentSelected" />
    <OrganizationDetailUserList :current-department="currentDepartment" @user-selected="handleUserSelected" />
    <UserDetailView v-if="currentUser" :user="currentUser" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OrganizationDetailDeptList from './OrganizationDetailDeptList.vue';
import OrganizationDetailUserList from './OrganizationDetailUserList.vue';
import UserDetailView from './UserDetailView.vue';

// 添加当前选中部门状态
const currentDepartment = ref(null);
// 添加当前选中用户状态
const currentUser = ref(null);

// 处理部门选中事件
function handleDepartmentSelected(department) {
  currentDepartment.value = department;
  // 部门切换时，清空当前选中用户
  currentUser.value = null;
}

// 处理用户选中事件
function handleUserSelected(user) {
  currentUser.value = user;
}
</script>

<style lang="scss" scoped></style>
