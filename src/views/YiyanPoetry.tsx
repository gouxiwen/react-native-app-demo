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
  const [yiyan, setYiyan] = React.useState('');

  const getPoetry = async () => {
    setPoetry('');
    setLoading(true);
    const res = await fetchGetYiyan();
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).msg, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setPoetry(res.data);
  };
  const getYiyan = async () => {
    setYiyan('');
    setLoading(true);
    const res = await fetchGetYiyan('hitokoto');
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).msg, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setYiyan(res.data);
  };

  React.useEffect(() => {
    getPoetry();
    getYiyan();
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
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>诗词与一言</Text>
          <View style={styles.divider}></View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.poetryCard}>
              <Text style={styles.cardTitle}>古诗词</Text>
              <Text style={styles.poetryText} selectable>
                {poetry}
              </Text>
            </View>
            <View style={styles.yiyanCard}>
              <Text style={styles.cardTitle}>一言</Text>
              <Text style={styles.yiyanText} selectable>
                {yiyan}
              </Text>
            </View>
          </View>
          <View style={styles.refreshContainer}>
            <Text style={styles.refreshTip} onPress={() => {getPoetry(); getYiyan();}}>
              刷新内容
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
  headerContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#534741', // 深褐色标题
    marginBottom: 8,
    letterSpacing: 2,
  },
  divider: {
    width: width * 0.3,
    height: 3,
    backgroundColor: '#8C6E54', // 古铜色分隔线
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  poetryCard: {
    width: width * 0.85,
    backgroundColor: '#FBF8F1', // 淡米色卡片背景
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E8DFC9', // 淡褐色边框
  },
  yiyanCard: {
    width: width * 0.85,
    backgroundColor: '#FBF8F1', // 淡米色卡片背景
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#8C6E54', // 古铜色边框
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#E8DFC9', // 淡褐色边框
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8C6E54', // 古铜色标题
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  yiyanText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#534741', // 深褐色文字
    textAlign: 'center',
    fontFamily: 'System',
  },
  poetryText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#534741', // 深褐色文字
    textAlign: 'center',
    fontFamily: 'System',
    fontStyle: 'italic',
  },
  refreshContainer: {
    marginTop: 20,
  },
  refreshTip: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#8C6E54', // 古铜色按钮背景
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default YiyanPoetryScreen;
