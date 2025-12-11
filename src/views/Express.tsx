import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetKuaidi } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo = [
  {
    current: {
      time: '--',
      ftime: '--',
      context: '--',
      location: '--',
    },
  },
];
function ExpressScreen() {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [kuaidi, setKuaidi] = React.useState<any[]>(defaultInfo);
  const getKuaidi = async () => {
    if (!text) return;
    setKuaidi(defaultInfo);
    setLoading(true);
    const res = await fetchGetKuaidi({
      id: text,
    });
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 1) {
      Toast.showWithGravity((res as any)?.text, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setKuaidi(res.data);
  };
  React.useEffect(() => {
    getKuaidi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TextInput
          style={styles.input}
          placeholder="请输入快递单号"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          onSubmitEditing={getKuaidi}
          clearButtonMode="while-editing"
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.timelineCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.headerTitle}>物流信息</Text>
            </View>
            <View style={styles.timelineContainer}>
              {kuaidi.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    <View
                      style={[
                        styles.timelineDotInner,
                        index === 0 && styles.activeDot,
                      ]}
                    />
                    {index < kuaidi.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={[styles.time, index === 0 && styles.activeTime]}>
                      {item.time}
                    </Text>
                    <Text
                      style={[
                        styles.context,
                        index === 0 && styles.activeContext,
                      ]}
                    >
                      {item.context}
                    </Text>
                    {item.location && (
                      <Text style={styles.location}>
                        位置：{item.location}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    padding: 16,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: primaryColor,
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  timelineContainer: {
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    position: 'relative',
    zIndex: 2,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#e0e0e0',
    top: 24,
    left: 11,
    height: 40,
    zIndex: 1,
  },
  timelineDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: primaryColor,
    shadowColor: primaryColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 4,
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  context: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  activeTime: {
    color: primaryColor,
    fontWeight: 'bold',
  },
  activeContext: {
    color: primaryColor,
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

export default ExpressScreen;
