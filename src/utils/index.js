// 通用工具函数模块

/**
 * 从网址中获取指定query参数
 */
export function getQueryParam(name) {
  // 从hash中提取query部分（从?开始的部分）
  const queryString = window.location.hash.split('?')[1];
  if (queryString) {
    // 将query字符串转换为URLSearchParams对象
    const searchParams = new URLSearchParams(queryString);
    // 获取指定参数的值
    return searchParams.get(name);
  }
  // 从正常参数中提取query
  return new URLSearchParams(window.location.search).get(name);
}
