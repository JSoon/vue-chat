import request from '@/custom/utils/request';

/**
 * 查询部门列表
 * @param {String} params.deptName 部门名称
 * @param {String} params.parentId 父部门ID
 * @param {Boolean} params.queryGrandson 是否查询子部门
 * @param {String} params.status 部门状态，0正常，1停用
 * @returns {Promise<Array>} 部门列表
 */
export function fetchDepartments(params) {
  return request({
    url: '/system/dept/list/im',
    method: 'get',
    params,
  });
}
