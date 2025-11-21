<template>
  <div class="flex">
    <OrganizationDetailDeptList :departments="organizations" />
    <OrganizationDetailUserList />
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
