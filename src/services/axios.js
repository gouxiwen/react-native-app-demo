import axios from 'axios';
import qs from 'qs';
// import { fetchEventSource } from '@microsoft/fetch-event-source'; // 服务端推送

const TYPEJSON = 'application/json';
const TYPEFORM = 'application/x-www-form-urlencoded';
const TYPEFORMDATA = 'multipart/form-data';

console.log('NODE_ENV', process.env.NODE_ENV);

const defaultConfig = {
  baseURL: '',
  timeout: 2 * 60 * 1000, // 设置全局超时时间两分钟
};
const instance = axios.create(defaultConfig);
// 设置默认post请求头。
instance.defaults.headers.common['Content-Type'] = TYPEJSON;

/** 添加请求拦截器，可以根据请求路径做一些个性化设置 */
instance.interceptors.request.use(
  async config => {
    if (typeof config.headers === 'undefined') config.headers = {};
    // 自定义请求头
    config.headers.token = '123456';
    return config;
  },
  error => Promise.reject(error),
);

/** 添加响应拦截器  * */
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    throw error; // 二者效果一样
    // return Promise.reject(error)
  },
);

export const get = (url, params, config) => {
  return instance.request({ method: 'get', url, params, ...config });
};

export const post = (url, data, params, config) => {
  return instance.request({ method: 'post', url, data, params, ...config });
};

export const postForm = (url, data, params, config) => {
  return instance.request({
    method: 'post',
    url,
    data: qs.stringify(data),
    params,
    ...config,
    headers: { 'content-type': TYPEFORM },
  });
};

export const postFormData = (url, data, params, config) => {
  return instance.request({
    method: 'post',
    url,
    data,
    params,
    ...config,
    headers: { 'content-type': TYPEFORMDATA },
  });
};

// 服务端推送get
// export function getServerMessage(url, options = {}) {
//   const ctrl = new AbortController();
//   fetchEventSource(`${url}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       hzToken: '',
//     },
//     signal: ctrl.signal,
//     ...options,
//   });
//   return () => {
//     ctrl.abort();
//   };
// }

// 服务端推送post
// export function postServerMessage(url, data = {}, options = {}) {
//   const ctrl = new AbortController();
//   fetchEventSource(`${url}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       hzToken: '',
//     },
//     signal: ctrl.signal,
//     body: JSON.stringify(data),
//     ...options,
//   });
//   return () => {
//     ctrl.abort();
//   };
// }
