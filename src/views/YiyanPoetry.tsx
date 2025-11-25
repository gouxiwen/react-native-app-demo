import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetYiyan } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const { width } = Dimensions.get('window');

function YiyanPoetryScreen() {
  const [loading, setLoading] = React.useState(false);
  const [poetry, setPoetry] = React.useState('');

  const getPoetry = async () => {
    setPoetry('');
    setLoading(true);
    const res = await fetchGetYiyan();
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).text, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setPoetry(res.data);
  };

  React.useEffect(() => {
    getPoetry();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={primaryColor}
        size="large"
      />
    );

  return (
    <CustomSafeAreaViws>
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.poetryCard}>
            <Text style={styles.poetryText} selectable>
              {poetry}
            </Text>
          </View>
          <View style={styles.refreshContainer}>
            <Text style={styles.refreshTip} onPress={getPoetry}>
              刷新诗词
            </Text>
          </View>
        </View>
      </View>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#F5F0E6', // 古风米色背景
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  poetryCard: {
    width: width * 0.9,
    backgroundColor: '#FBF8F1', // 淡米色卡片背景
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8DFC9', // 淡褐色边框
  },
  poetryText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#534741', // 深褐色文字
    textAlign: 'center',
    fontFamily: 'System',
  },
  refreshContainer: {
    marginTop: 20,
  },
  refreshTip: {
    fontSize: 14,
    color: '#8C6E54', // 古铜色按钮文字
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F0E6D2', // 淡米黄色按钮背景
  },
});

export default YiyanPoetryScreen;
