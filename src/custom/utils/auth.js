import { getItem, removeItem, setItem } from '@/ui/util/storageHelper';

const TokenKey = 'Authorization';

export function getToken() {
  return getItem(TokenKey);
}

export function setToken(token) {
  return setItem(TokenKey, token);
}

export function removeToken() {
  return removeItem(TokenKey);
}
