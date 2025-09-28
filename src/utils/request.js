import axios from 'axios';
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus';
import { getToken } from '@/utils/auth';
import errorCode from '@/utils/errorCode';
import { tansParams, blobValidate } from '@/utils/ruoyi';
// import cache from '@/plugins/cache';
// import { saveAs } from 'file-saver';
// import useUserStore from '@/store/modules/user';
// import router from '@/router';

let downloadLoadingInstance;
// 是否显示重新登录
export const isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 60 * 1000,
  headers: {
    'Source-Platform-Code': process.env.VUE_APP_SYSTEM_CODE,
  },
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否允许数据重复提交，默认不允许
    const allowRepeatSubmit = config.allowRepeatSubmit;
    // 是否需要 token，若为 false，则不会将 token 添加到请求头中
    const isToken = config.headers?.isToken === false;
    // 若请求头中没有 Authorization，则将 token 添加到请求头中；否则使用请求头中的 Authorization
    if (!config.headers['Authorization'] && getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (config.method === 'post' || config.method === 'put') {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };

      //#region NOTE: 处理 POST 请求 payload 中的参数到 params，兼容后端接口
      config.data = config.data || {};
      // 分页器参数
      if ('pageNum' in config.data) {
        config.params = config.params || {};
        Object.assign(config.params, {
          pageNum: config.data?.pageNum,
        });
      }
      if ('pageSize' in config.data) {
        config.params = config.params || {};
        Object.assign(config.params, {
          pageSize: config.data?.pageSize,
        });
      }
      // 列排序参数
      if ('orderField' in config.data) {
        config.params = config.params || {};
        Object.assign(config.params, {
          orderField: config.data?.orderField,
        });
      }
      if ('orderBy' in config.data) {
        config.params = config.params || {};
        Object.assign(config.params, {
          orderBy: config.data?.orderBy,
        });
      }
      // 统计列参数
      if ('sumColumn' in config.data) {
        config.params = config.params || {};
        Object.assign(config.params, {
          sumColumn: config.data?.sumColumn,
        });
      }
      //#endregion

      // 重复请求逻辑处理
      if (!allowRepeatSubmit) {
        //   const sessionObj = cache.session.getJSON('sessionObj');
        //   if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
        //     cache.session.setJSON('sessionObj', requestObj);
        //   } else {
        //     const s_url = sessionObj.url; // 请求地址
        //     const s_data = sessionObj.data; // 请求数据
        //     const s_time = sessionObj.time; // 请求时间
        //     const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        //     if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
        //       const message = 'Request Repeat';
        //       console.warn(`[${s_url}]: ` + message);
        //       return Promise.reject(new Error(message));
        //     } else {
        //       cache.session.setJSON('sessionObj', requestObj);
        //     }
        //   }
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }
    const { ignoreMsg } = res.config;
    // HTTP 状态码 20x，接口响应业务码 401
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            isRelogin.show = false;
            // useUserStore()
            //   .logOut()
            //   .then(() => {
            //     router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } });
            //   });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
    } else if (code === 500) {
      if (!ignoreMsg) {
        ElMessage({ message: msg, type: 'error' });
      }
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      if (!ignoreMsg) {
        ElMessage({ message: msg, type: 'warning' });
      }
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      if (!ignoreMsg) {
        ElNotification.error({ title: msg });
      }
      return Promise.reject(res.data);
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    console.log('err' + error);
    let { message } = error;
    const { response, config } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
      // HTTP 状态码 401
      if (response.status === 401) {
        // useUserStore().logOut();
      }
    }
    if (!config?.ignoreMsg) {
      // NOTE: 项目要求屏蔽重复提交错误提示
      if (message !== 'Request Repeat') {
        ElMessage({ message: message, type: 'error', duration: 5 * 1000 });
      }
    }
    return Promise.reject(error);
  }
);

// // 通用下载方法
// export function download(url, params, filename, config) {
//   downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });
//   return service
//     .post(url, params, {
//       transformRequest: [
//         (params) => {
//           return tansParams(params);
//         },
//       ],
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       responseType: 'blob',
//       ...config,
//     })
//     .then(async (data) => {
//       const isBlob = blobValidate(data);
//       if (isBlob) {
//         const blob = new Blob([data]);
//         saveAs(blob, filename);
//       } else {
//         const resText = await data.text();
//         const rspObj = JSON.parse(resText);
//         const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
//         ElMessage.error(errMsg);
//       }
//       downloadLoadingInstance.close();
//     })
//     .catch((r) => {
//       console.error(r);
//       ElMessage.error('下载文件出现错误，请联系管理员！');
//       downloadLoadingInstance.close();
//     });
// }

export default service.request;
