import request from '@/custom/utils/request';

/**
 * 查询部门列表
 * @param {String} params.deptName 部门名称
 * @param {String} params.parentId 父部门ID
 * @returns {Promise<Array>} 部门列表
 */
export function fetchDepartments(params) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params,
  });
}
