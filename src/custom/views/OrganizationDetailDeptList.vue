<template>
  <div class="w-[300px] h-full overflow-auto border-r border-gray-200">
    <div class="flex items-center h-[66px] pl-4 text-lg font-bold border-b border-gray-200 sticky top-0 bg-white z-10">
      {{ sharedContactState.currentOrganization.deptName }}
    </div>
    <el-tree v-if="treeData.length" :data="treeData" :props="treeProps" highlight-current accordion class="p-2 text-sm">
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
              {{ data.deptName ? data.deptName.charAt(0) : '' }}
            </div>
          </div>
          <div class="flex-1 truncate">{{ node.label }}</div>
        </div>
      </template>
    </el-tree>
    <div v-else class="text-center text-gray-400 py-10">暂无部门数据</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElTree, ElImage } from 'element-plus';
import store from '../../store';

// 从父组件接收部门数据
const props = defineProps({
  departments: {
    type: Array,
    default: () => [],
  },
});

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

// 计算树形数据
const treeData = computed(() => {
  if (!props.departments?.length) {
    return [];
  }

  // 使用当前组织的deptId作为根节点的parentId
  const currentOrgDeptId = sharedContactState.currentOrganization?.deptId;
  // 确保currentOrgDeptId存在，避免计算错误
  if (!currentOrgDeptId) {
    return [];
  }

  return buildTreeData(props.departments, currentOrgDeptId);
});
</script>

<style lang="scss" scoped>
:deep(.organization-dept-item) {
  .el-tree-node__content {
    height: auto;
  }
}
</style>
