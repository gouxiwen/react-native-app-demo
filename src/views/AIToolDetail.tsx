import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CommonNavigationProps } from '../../global';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { fetchGetAIToolDetail } from '../services/http';

interface AITool {
  id: string;
  name: string;
  purpose: string;
  company: string;
  isPaid: boolean;
  category: string;
  description?: string;
  website?: string;
}

const AIToolDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<CommonNavigationProps>();
  const initialTool = route.params as AITool;
  const [tool, setTool] = React.useState<AITool | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // 确保navigation对象存在
  console.log('Navigation object:', navigation);
  console.log('Initial tool params:', initialTool);

  const loadToolDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchGetAIToolDetail(initialTool.id);
      setTool(response.data);
    } catch (err) {
      setError('获取工具详情失败，请重试');
      console.error('Error fetching tool detail:', err);
      // 如果网络请求失败，使用初始参数
      setTool(initialTool);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadToolDetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <CustomSafeAreaViws top={0}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载工具详情中...</Text>
        </View>
      </CustomSafeAreaViws>
    );
  }

  if (error || !tool) {
    return (
      <CustomSafeAreaViws top={0}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || '工具详情加载失败'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadToolDetail}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </CustomSafeAreaViws>
    );
  }

  return (
    <CustomSafeAreaViws top={0}>
      <ScrollView style={styles.container}>
        <View style={styles.toolCard}>
          <View style={styles.toolHeader}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <View style={[styles.paidBadge, { backgroundColor: tool.isPaid ? '#FF3B30' : '#34C759' }]}>
              <Text style={styles.paidBadgeText}>{tool.isPaid ? '收费' : '免费'}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>分类</Text>
            <Text style={styles.infoValue}>{tool.category}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>用途</Text>
            <Text style={styles.infoValue}>{tool.purpose}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>所属公司</Text>
            <Text style={styles.infoValue}>{tool.company}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>工具介绍</Text>
            <Text style={styles.descriptionText}>
              {tool.description || `${tool.name}是一款由${tool.company}开发的AI工具，主要用于${tool.purpose}。该工具属于${tool.category}类别，${tool.isPaid ? '需要付费使用' : '可免费使用'}。作为一款现代化的AI工具，它能够帮助用户更高效地完成相关任务，提高工作和学习效率。`}
            </Text>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                if (tool.website) {
                  Alert.alert('访问官网', `即将打开${tool.name}的官方网站`, [
                    { text: '取消', style: 'cancel' },
                    { text: '确定', onPress: () => Linking.openURL(tool.website!) }
                  ]);
                } else {
                  Alert.alert('访问官网', `即将打开${tool.name}的官方网站`);
                }
              }}
            >
              <Text style={styles.actionButtonText}>访问官网</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                Alert.alert('了解更多', `这里将提供${tool.name}的更多详细信息`);
              }}
            >
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>了解更多</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </CustomSafeAreaViws>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  toolCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  toolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  paidBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  descriptionSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 24,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#495057',
  },
});

export default AIToolDetailScreen;