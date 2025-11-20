// 自定义一个安全区域组件，reactnative提个的SafeAreaView组件有问题，以下说明来自reactnavigation文档https://reactnavigation.org/docs/handling-safe-area：
// 虽然 React Native 导出了一个 SafeAreaView 组件，但该组件仅支持 iOS 10 及更高版本，不支持旧版 iOS 或 Android 系统。
// 此外，它还存在一些问题，例如，如果包含安全区域的屏幕正在进行动画，则会导致画面跳动。
// 因此，我们建议使用 react-native-safe-area-context 库中的 useSafeAreaInsets hook 来更可靠地处理安全区域

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomSafeAreaViws({
  children,
  top,
  bottom,
  left,
  right,
}: {
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: top ?? insets.top,
        paddingBottom: bottom ?? insets.bottom,
        paddingLeft: left ?? insets.left,
        paddingRight: right ?? insets.right,
      }}
    >
      {children}
    </View>
  );
}

export default CustomSafeAreaViws;
