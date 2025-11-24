<template>
  <div class="w-[300px] h-full overflow-auto border-r border-gray-200">
    <div
      class="h-[66px] leading-[66px] px-4 text-lg font-bold border-b border-gray-200 sticky top-0 bg-white z-10 truncate"
    >
      {{ sharedContactState.currentOrganization.deptName }}
    </div>
    <el-form :model="searchForm" class="p-3 bg-gray-50 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <el-input
          v-model="searchForm.deptName"
          placeholder="搜索部门"
          clearable
          @clear="handleSearch"
          @input="handleSearch"
          class="flex-1"
        />
      </div>
    </el-form>
    <!-- 加载中的骨架图 -->
    <el-skeleton v-if="loading" animated class="p-4">
      <template #template>
        <div class="flex flex-col gap-2">
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
          <el-skeleton-item variant="text" style="width: 100%" />
          <el-skeleton-item variant="text" style="width: 70%" />
        </div>
      </template>
    </el-skeleton>
    <!-- 部门树 -->
    <el-tree
      ref="deptTree"
      v-else-if="treeData.length"
      :data="treeData"
      :props="treeProps"
      :filter-node-method="filterNodeMethod"
      :highlight-current="true"
      :accordion="false"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      class="p-2 text-sm"
    >
      <template #default="{ node, data }">
        <div class="flex items-center gap-2 py-1 min-w-0">
          <div class="w-7 h-7 flex items-center justify-center">
            <el-image
              v-if="data.deptIconUrl"
              :src="data.deptIconUrl"
              :preview-src-list="[]"
              fit="cover"
              class="w-full h-full rounded-md"
            />
            <div v-else class="w-full h-full rounded-md bg-[#0074ff] text-white flex items-center justify-center">
              {{ node.label ? node.label.charAt(0) : '' }}
            </div>
          </div>
          <div class="flex-1 truncate" :title="node.label">{{ node.label }}</div>
        </div>
      </template>
    </el-tree>
    <el-empty v-else description="暂无部门数据" :image-size="64" />
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { ElTree, ElImage, ElForm, ElInput, ElEmpty, ElSkeleton, ElSkeletonItem } from 'element-plus';
import store from '../../store';
import { fetchDepartments } from '../api/organization';

// 定义事件
const emit = defineEmits(['dept-selected']);

// 添加加载状态
const loading = ref(false);
// 部门数据
const departments = ref([]);

// 搜索表单
const searchForm = ref({
  deptName: '',
});

// 树组件引用
const deptTree = ref(null);

// 处理节点点击事件
function handleNodeClick(data) {
  emit('dept-selected', data);
}

// 处理搜索
function handleSearch() {
  if (deptTree.value) {
    deptTree.value.filter(searchForm.value.deptName);
  }
}

// 节点过滤方法
function filterNodeMethod(value, data, node) {
  if (!value) {
    return true;
  }
  // 如果当前节点匹配搜索条件，就显示该节点
  return data.deptName.toLowerCase().includes(value.toLowerCase());
}

// 获取共享的联系状态
const sharedContactState = store.state.contact;

// 树组件的属性配置
const treeProps = {
  key: 'deptId',
  label: 'deptName',
  children: 'children',
  class: 'organization-dept-item',
};

/**
 * 将平级结构的部门数据转换为树形结构
 * @param {Array} list 平级的部门数据列表
 * @param {String|Number} rootParentId 根节点的父ID
 * @returns {Array} 树形结构的部门数据
 */
function buildTreeData(list, rootParentId) {
  const result = [];
  const map = {};

  // 首先创建所有节点的映射
  list.forEach((item) => {
    map[item.deptId] = { ...item, children: [] };
  });

  // 然后建立父子关系
  list.forEach((item) => {
    const current = map[item.deptId];
    if (item.parentId === rootParentId) {
      // 如果是根节点，直接添加到结果中
      result.push(current);
    } else if (map[item.parentId]) {
      // 如果不是根节点，添加到父节点的children中
      map[item.parentId].children.push(current);
    } else {
      // 如果不是根节点且父节点不存在，直接添加到结果中（视为第一级部门）
      result.push(current);
    }
  });

  return result;
}

// 查询部门数据
async function queryDepartments() {
  loading.value = true;
  const { data } = await fetchDepartments({
    parentId: sharedContactState.currentOrganization.deptId,
    queryGrandson: true,
    status: 0,
  }).finally(() => (loading.value = false));
  departments.value = data || [];
}

// 计算树形数据
const treeData = computed(() => {
  if (!departments?.value?.length) {
    return [];
  }

  // 使用当前组织的deptId作为根节点的parentId
  const currentOrgDeptId = sharedContactState.currentOrganization?.deptId;
  // 确保currentOrgDeptId存在，避免计算错误
  if (!currentOrgDeptId) {
    return [];
  }

  return buildTreeData(departments.value, currentOrgDeptId);
});

watchEffect(() => {
  queryDepartments();
});
</script>

<style lang="scss" scoped>
:deep(.organization-dept-item) {
  .el-tree-node__content {
    height: auto;
  }
}
</style>
