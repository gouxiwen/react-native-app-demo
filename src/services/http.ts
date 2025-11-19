// 全局使用的接口
import { get } from './axios';
// 定义接口：
// url      请求地址
// function 请求方法

// ---------->获取天气
export function fetchGetTianqi(data: { city: string; type: string }) {
  return get('http://shanhe.kim/api/za/tianqi.php', data);
}
// ---------->随机ai绘制图
export function fetchGetAiImg() {
  return get('http://shanhe.kim/api/tu/aiv1.php', {
    type: 'txt',
  });
}
// ---------->获取短视频列表
export type VideoListParams = {
  page: number;
  size: number;
};
export function fetchGetMinVideo(data: VideoListParams) {
  return get('https://api.apiopen.top/api/getMiniVideo', data);
}
