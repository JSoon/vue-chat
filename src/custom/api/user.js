import request from '@/custom/utils/request';

/**
 * 查询用户列表
 * @param {String} params.deptId 部门ID
 * @param {String} params.nickName 用户昵称
 * @param {String} params.queryGrandson 是否查询子部门
 * @returns {Promise<Array>} 用户列表
 */
export function fetchDepartmentUsers(params) {
  return request({
    url: '/system/user/all',
    method: 'get',
    params,
  });
}
