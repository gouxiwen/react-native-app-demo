// 全局使用的接口
import { get } from './axios';
// 定义接口：
// url      请求地址
// function 请求方法

// ---------->查询天气
export function fetchGetTianqi(data: { city: string; type?: string }) {
  return get('http://shanhe.kim/api/za/tianqi.php', {
    city: data.city,
    type: data.type || 'json',
  });
}
// ---------->查询快递
export function fetchGetKuaidi(data: { id: string; type?: string }) {
  return get('http://shanhe.kim/api/za/kuaidi.php', {
    id: data.id,
    type: data.type || 'json',
  });
}
// ---------->查询油价
export function fetchGetYoujia(data: { province: string; type?: string }) {
  return get('http://shanhe.kim/api/youjia/youjia.php', {
    province: data.province,
    type: data.type || 'json',
  });
}
// ---------->随机ai绘制图
export function fetchGetAiImg(type: string) {
  if (type === 'ai') {
    return get('http://shanhe.kim/api/tu/aiv1.php', {
      type: 'txt',
    });
  } else if (type === 'head') {
    return get('https://v2.xxapi.cn/api/head', {
      return: 'json',
    }).then(res => {
      if ((res as any).code === 200) {
        return (res as any).data;
      }
    });
  } else if (type === 'wallpaper') {
    return get('https://v2.xxapi.cn/api/random4kPic', {
      type: 'wallpaper',
      return: 'json',
    }).then(res => {
      if ((res as any).code === 200) {
        return (res as any).data;
      }
    });
  }
}
// ---------->获取短视频列表
export type VideoListParams = {
  page: number;
  size: number;
};
export function fetchGetMinVideo(data: VideoListParams) {
  return get('https://api.apiopen.top/api/getHaoKanVideo', data);
}

// ---------->车辆价格信息查询
export function fetchGetCarPrice(query: string) {
  return get('https://v2.xxapi.cn/api/carprice', {
    search: query,
  });
}
// ---------->每日英语
export function fetchGetEnglishwords() {
  return get('https://v2.xxapi.cn/api/randomenglishwords');
}
// ---------->图灵机器人
export function fetchGetTuring(msg: string) {
  return get('https://v2.xxapi.cn/api/turing', { msg });
}
// ---------->随机一言/古诗词
export function fetchGetYiyan(type: 'yiyan' | 'poetry' = 'poetry') {
  return get('https://v2.xxapi.cn/api/yiyan', { type });
}
