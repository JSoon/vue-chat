<template>
  <section>
    <ul>
      <li v-for="(organization, index) in rootOrganizations" :key="index" @click="showOrganization(organization)">
        <div
          class="organization-item"
          v-bind:class="{
            active:
              sharedContactState.currentOrganization &&
              sharedContactState.currentOrganization.deptId === organization.deptId,
          }"
        >
          <img class="avatar" :src="organization.portrait ? organization.portrait : defaultPortraitUrl" />
          <span class="single-line">{{ organization.deptName }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchDepartments } from '../api/organization';
import store from '../../store';
import Config from '../../config';

const sharedContactState = store.state.contact;
const defaultPortraitUrl = Config.DEFAULT_ORGANIZATION_PORTRAIT_URL;

// 查询根部门列表
const rootOrganizations = ref([]);
async function queryRootDepartments() {
  const { data } = await fetchDepartments({ parentId: '0' });
  rootOrganizations.value = data || [];
}

// 显示部门
function showOrganization(organization) {
  store.setCurrentOrganization(organization);
}

onMounted(() => {
  queryRootDepartments();
});
</script>

<style lang="scss" scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 3px;
}

.organization-item {
  height: 50px;
  padding: 5px 10px 5px 30px;
  display: flex;
  font-size: 13px;
  align-items: center;
}

.organization-item.active {
  background-color: #d6d6d6;
}

.organization-item span {
  margin-left: 10px;
}
</style>
