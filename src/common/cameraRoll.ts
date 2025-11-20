import { PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';

async function hasAndroidPermission() {
  const getCheckPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }
  const getRequestPermissionPromise = () => {
    if (+Platform.Version >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        statuses =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
}

export async function savePicture(
  localImagePath: string, // 标签必须是本地图像或视频 URI，例如“file:///sdcard/img.png”
  type?: 'photo' | 'video' | 'auto',
  album?: string,
) {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.saveAsset(localImagePath, { type, album });
}

/**
 2  * 下载网页图片并保存到相册
 3  * @param uri  图片地址
 4  * @returns {*}
 5  */
export const downloadImage = (uri?: string) => {
  if (!uri) return null;
  return new Promise((resolve, reject) => {
    let timestamp = new Date().getTime(); //获取当前时间错
    // eslint-disable-next-line no-bitwise
    let random = String((Math.random() * 1000000) | 0); //六位随机数
    let dirs =
      Platform.OS === 'ios'
        ? RNFS.LibraryDirectoryPath
        : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
    const downloadDest = `${dirs}/${timestamp + random}.jpg`;
    const formUrl = uri;
    const options = {
      fromUrl: formUrl,
      toFile: downloadDest,
      background: true,
      begin: () => {
        // console.log('begin', res);
        // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
      },
    };
    try {
      const ret = RNFS.downloadFile(options);
      ret.promise
        .then(res => {
          // console.log('success', res);
          // console.log('file://' + downloadDest)
          var promise = CameraRoll.saveAsset(downloadDest);
          promise
            .then(function (result) {
              Toast.showWithGravity(
                '保存成功！地址如下：\n' + result,
                Toast.LONG,
                Toast.TOP,
              );
            })
            .catch(function (error) {
              console.log('error', error);
              // alert('保存失败！\n' + error);
            });
          resolve(res);
        })
        .catch(err => {
          reject(new Error(err));
        });
    } catch (e: any) {
      reject(new Error(e));
    }
  });
};
