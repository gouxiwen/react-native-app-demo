## 单独启动开发服务

如果使用多线程插件 react-native-worklets，推荐清除 Metro 打包器缓存在启动服务

```
yarn start --reset-cache
```

真机调试时，需要使用 adb 工具，将手机连接到电脑，并开启开发者选项中的 USB 调试，然后重连 tcp

```
adb reverse tcp:8081 tcp:8081
```

## 打包到真机

### 安卓

Android 要求所有应用在安装之前都必须使用证书进行数字签名。为了通过 谷歌应用商店 分发你的 Android 应用，需要使用发布密钥进行签名，然后该发布密钥需要用于所有未来的更新

1. 首先进入 jdk 目录
2. 执行生成密钥命令
3. 生成后复制到 android/app 目录下

#### Windows

```
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

正在为以下对象生成 2,048 位 RSA 密钥对和自签名证书 (SHA256withRSA) (有效期为 10,000 天):
CN=xiwen, OU=test, O=test, L=test, ST=test, C=cn
[正在存储 my-release-key.keystore]

口令 123456

#### Mac

```
sudo keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

正在为以下对象生成 2,048 位 RSA 密钥对和自签名证书 (SHA256withRSA) (有效期为 10,000 天):
CN=xiwen, OU=test, O=test, L=test, ST=test, C=cn
[正在存储 my-release-key.keystore]

口令 123456

### 官方基础配置

```
npm run android -- --mode="release"
```

### 自定义多风格配置后

```
bundle-android-dev
bundle-android-release
...
```

## 编译原生模块或组件

<!-- 目前发现原生模块和原生组件只能选一个进行编译 -->

## 编译原生模块 package.json 配置

```
   "codegenConfig": {
     "name": "NativeLocalStorageSpec",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.nativelocalstorage"
     }
   },
```

## 编译原生组件 package.json 配置

```
  "codegenConfig": {
    "name": "AppSpec",
    "type": "components",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.webview"
    }
  },

```

## 页面导航

https://reactnavigation.org/

## 设置 APP 名称、应用图标

https://blog.csdn.net/Landen2011/article/details/125603821

## 为安卓添加启动图

https://blog.csdn.net/qq_39524670/article/details/83020123

刘海屏无法全屏

### 解决打包生成时报错 AAPT: error: file failed to compile

解决办法：在项目的 build.gradle 中 android 层内添加以下：
aaptOptions {
// 是否开启 png 图片优化检查
useNewCruncher false
cruncherEnabled false
}
或者
aaptOptions.cruncherEnabled = false  
aaptOptions.useNewCruncher = false

### 生成图标

https://icon.wuruihong.com/
角标不支持自定义

https://icon.kitchen/i/H4sIAAAAAAAAA6tWKkvMKU0tVrKqVkpJLMoOyUjNTVWySkvMKU7VUUpLD6ksAHKVMnMT01OVQAK%2BicXZUPlaHaXc%2FJTSHJDuaKXEvJSi%2FMwUoKLM%2FGIgWZ6apBRbCwC9UKrUYAAAAA%3D%3D

支持自定义角标，但是生成的图标有外边距，原因是这里生成的是新的自适应图标：
https://cloud.tencent.com/developer/article/1456330

总结：

icon 都读取读取 AndroidManifest.xml 中的 icon 配置。

android:roundIcon 是 Android 7.1 的过渡配置

如果你的 APP 中的 targetSdkVersion 是低于 26 的，那么就可以不用进行应用图标适配，Android 8.0 系统仍然是向下兼容的

但是如果你将 targetSdkVersion 指定到了 26 或者更高，那么 Android 系统就会认为你的 APP 已经做好了 8.0 系统的适配工作，当然包括了应用图标的适配，读取 mipmap-anydpi-v26 目录下的配置进行自适应。

## 网络请求调试

使用 reactotron，reactotron 使用配套的插件 reactotron-react-native 连接到应用，插件配置文件 ReactotronConfig.js

https://docs.infinite.red/reactotron/quick-start/react-native/

react-native-debugger 在新版本上已不可用，react-native-debugger 依赖远程 js 调试，但在 React Native 0.73 版本中，远程 JavaScript 调试功能已被弃用，未来版本将彻底移除。

## 环境变量

使用 react-native-config 配置，https://github.com/lugg/react-native-config

不同终端加载环境变量

```
$ ENVFILE=.env.staging react-native run-ios # bash
$ SET ENVFILE=.env.staging && react-native run-ios # windows
$ env:ENVFILE=".env.staging"; react-native run-ios # powershell
```

## 构建任务

assemble、bundle、compile、package、install

assemble：编译并打包，生成 APK 文件

bundle：编译并打包，生成 AAB 文件

install：安装 APK 文件到设备

https://blog.csdn.net/shuizhizhiyin/article/details/140548517

### 构建类型

assembleRelease，assembleRelease 对应 build.gradle 中的 buildType，如 assembleDebug、assembleRelease，也可以自定义其他构建类型，如 staging

执行./gradlew assembleRelease 打包安卓

### 不同风味打包

assembleDevRelease，assembleStagingRelease，assembleProdRelease 对应 build.gradle 中的 productFlavors

--mode=DevDebug 为 productFlavors 和 buildTypes 组合的 build 变体，此命令等效于 cd android && ./gradlew installDevDebug，可以自由组合不同的构建类型和变体

android/app/src 下的 main 为默认的构建类型，可以创建不同的文件夹，如 dev、staging、prod，分别对应不同的风味，可以继承 main 的配置后进行个性化配置

安卓构建文档：https://developer.android.com/build/build-variants?hl=zh-cn#groovy

### 加快构建速度

1. 指定 CPU 架构

cli 命令添加--active-arch-only 会自动识别设备的 CPU 架构，只编译对应的架构，加快构建速度

```
react-native run-android --active-arch-only
```

如果直接使用 gradlew 命令，则使用-PreactNativeArchitectures=x86,x86_64,arm64-v8a,armeabi-v7a 指定特定 CPU 架构

```
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```

需要注意如果是打生成包，应该去掉改参数，以适应所有设备

2. 启用 Gradle 配置缓存

android/gradle.properties 文件中添加以下行来启用 Gradle 配置缓存：

```
 # 启用 Gradle 配置缓存
org.gradle.configuration-cache=true
# 忽略配置缓存问题
org.gradle.configuration-cache.problems=warn
```

## 依赖库配置记录

react-native-fs 文档过时，不需要安卓文档进行手动配置，直接安装

### IOS 待配置

1. https://reactnavigation.org/docs/getting-started/
2. https://github.com/react-native-config/react-native-config
3. https://github.com/DylanVann/react-native-fast-image
4. https://github.com/TheWidlarzGroup/react-native-video
5. https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation
6. https://github.com/itinance/react-native-fs
7. https://github.com/react-native-cameraroll/react-native-cameraroll
8. https://www.npmjs.com/package/react-native-simple-toast
9. https://www.npmjs.com/package/react-native-splash-screen
10. https://docs.swmansion.com/react-native-worklets/docs/
11. https://react-native-async-storage.github.io/2.0/Installation/
12. https://reactnavigation.org/docs/tab-view 13.https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation

其他配置：图标、启动页、应用名称、应用风味及环境区分、权限
