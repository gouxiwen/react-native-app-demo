## 启动

如果使用多线程插件 react-native-worklets，推荐清除 Metro 打包器缓存在启动服务

```
yarn start --reset-cache
```

## 安卓密钥

```
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

正在为以下对象生成 2,048 位 RSA 密钥对和自签名证书 (SHA256withRSA) (有效期为 10,000 天):
CN=xiwen, OU=test, O=test, L=test, ST=test, C=cn
[正在存储 my-release-key.keystore]

口令 123456

## 打包到真机

```
npm run android -- --mode="release"
```

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
