// 测试配置
import { NativeModules, Platform } from 'react-native';
import Config from 'react-native-config';


// 获取配置的多种方式
let nativeConfigCache = null;

export const getConfigValue = async (key, defaultValue = '') => {
  try {
    // 方式1: 优先从原生模块获取（缓存结果）
    if (Platform.OS === 'android' && NativeModules.ConfigModule) {
      if (nativeConfigCache === null) {
        try {
          nativeConfigCache = await NativeModules.ConfigModule.getConfig();
          console.log('Native config loaded and cached:', nativeConfigCache);
        } catch (error) {
          console.warn('Failed to load native config:', error);
          nativeConfigCache = {};
        }
      }

      if (nativeConfigCache && nativeConfigCache[key]) {
        console.log(
          `Config from native module: ${key}=${nativeConfigCache[key]}`,
        );
        return nativeConfigCache[key];
      }
    }

    // 方式2: 尝试从react-native-config获取
    if (Config && Config[key]) {
      console.log(`Config from react-native-config: ${key}=${Config[key]}`);
      return Config[key];
    }

    // 方式3: 使用默认值
    console.log(`Using default value for ${key}: ${defaultValue}`);
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to get config for ${key}:`, error);
    return defaultValue;
  }
};

// 同步版本的配置获取（用于初始化）
export const getConfigValueSync = (key, defaultValue = '') => {
  try {
    // 优先从react-native-config获取
    if (Config && Config[key]) {
      console.log(
        `Config from react-native-config (sync): ${key}=${Config[key]}`,
      );
      return Config[key];
    }

    // 使用默认值
    console.log(`Using default value for ${key} (sync): ${defaultValue}`);
    return defaultValue;
  } catch (error) {
    console.warn(`Failed to get config for ${key} (sync):`, error);
    return defaultValue;
  }
};

// 打印接口域名配置信息
console.log(
  'Config.FLAVOR:',
  getConfigValueSync('FLAVOR'),
  '=Config==config',
  Config,
);

// 如果Config.FLAVOR为空，尝试从环境变量获取
if (!getConfigValueSync('FLAVOR')) {
  console.warn('Config.FLAVOR is undefined, trying to get from environment...');
  // 可以在这里添加备用方案
}