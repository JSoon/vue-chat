import request from '@/utils/request';
import Config from '../config';
import wfc from '../wfc/client/wfc';

// 获取IM-Token信息，不刷新im用户基础信息
export function getImToken() {
  return request({
    url: '/hl-server/im/token/v2/obtain',
    method: 'post',
    data: {
      platform: Config.getWFCPlatform(),
      clientId: wfc.getClientId(),
    },
  });
}

// 获取IM-Token信息，同时刷新im用户基础信息
export function getImTokenRefresh() {
  return request({
    url: '/hl-server/im/token/v2/refurbish',
    method: 'post',
    data: {
      platform: Config.getWFCPlatform(),
      clientId: wfc.getClientId(),
    },
  });
}
