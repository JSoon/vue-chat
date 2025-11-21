<template>
  <div class="flex">
    <OrganizationDetailDeptList :departments="organizations" @dept-selected="handleDepartmentSelected" />
    <OrganizationDetailUserList :current-department="currentDepartment" />
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import Config from '../../config';
import store from '../../store';
import { fetchDepartments } from '../api/organization';
import OrganizationDetailDeptList from './OrganizationDetailDeptList.vue';
import OrganizationDetailUserList from './OrganizationDetailUserList.vue';

const sharedContactState = store.state.contact;
const defaultPortraitUrl = Config.DEFAULT_DEPARTMENT_PORTRAIT_URL;

const organizations = ref([]);
// 添加当前选中部门状态
const currentDepartment = ref(null);

// 处理部门选中事件
function handleDepartmentSelected(department) {
  currentDepartment.value = department;
}

async function queryDepartments() {
  const { data } = await fetchDepartments({
    parentId: sharedContactState.currentOrganization.deptId,
    queryGrandson: true,
  });
  organizations.value = data || [];
}

watchEffect(() => {
  queryDepartments();
});
</script>

<style lang="scss" scoped></style>
