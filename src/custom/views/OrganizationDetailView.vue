<template>
  <div class="flex">
    <OrganizationDetailDeptList @dept-selected="handleDepartmentSelected" />
    <OrganizationDetailUserList :current-department="currentDepartment" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OrganizationDetailDeptList from './OrganizationDetailDeptList.vue';
import OrganizationDetailUserList from './OrganizationDetailUserList.vue';

// 添加当前选中部门状态
const currentDepartment = ref(null);

// 处理部门选中事件
function handleDepartmentSelected(department) {
  currentDepartment.value = department;
}
</script>

<style lang="scss" scoped></style>
