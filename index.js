/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// 启动网络调试工具
if (__DEV__) {
  require('./ReactotronConfig');
}
