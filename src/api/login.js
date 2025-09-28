import request from '@/utils/request';
import Config from '../config';
import wfc from '../wfc/client/wfc';

// 临时登录方法
export function login(userId) {
  return request({
    url: '/hl-server/im/token/v1/obtain',
    headers: {
      isToken: false,
    },
    method: 'post',
    data: {
      userId,
      platform: Config.getWFCPlatform(),
      clientId: wfc.getClientId(),
    },
  });
}
