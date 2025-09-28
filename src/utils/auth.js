import Cookies from 'js-cookie';

const TokenKey = 'Authorization';
const options = {
  // path: process.env.VITE_BASE_URL
  path: '/',
};

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, options);
}

export function removeToken() {
  return Cookies.remove(TokenKey, options);
}
