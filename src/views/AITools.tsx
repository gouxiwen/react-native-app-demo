import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { fetchGetAITools } from '../services/http';

interface AITool {
  id: string;
  name: string;
  purpose: string;
  company: string;
  isPaid: boolean;
  category: string;
}

const AIToolsScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('全部');
  const [aiTools, setAiTools] = React.useState<AITool[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchGetAITools();
      setAiTools(response.data);
    } catch (err) {
      setError('获取工具列表失败，请重试');
      console.error('Error fetching AI tools:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadTools();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTools();
  };

  const categories = ['全部', ...Array.from(new Set(aiTools.map(tool => tool.category)))];

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.purpose.toLowerCase().includes(searchText.toLowerCase()) ||
                         tool.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedTools = filteredTools.reduce((groups, tool) => {
    const category = tool.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(tool);
    return groups;
  }, {} as Record<string, AITool[]>);

  const renderCategory = ({ item: categoryName }: { item: string }) => {
    const tools = groupedTools[categoryName];
    if (!tools || tools.length === 0) return null;

    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>
        {tools.map(tool => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolCard}
            onPress={() => navigation.navigate('AIToolDetail' as any, tool)}
            activeOpacity={0.7}
          >
            <View style={styles.toolHeader}>
              <Text style={styles.toolName}>
                {tool.name}
                <View style={[
                  styles.paidBadge,
                  { backgroundColor: tool.isPaid ? '#FF3B30' : '#34C759' }
                ]}>
                  <Text style={styles.paidBadgeText}>{tool.isPaid ? '收费' : '免费'}</Text>
                </View>
              </Text>
            </View>
            <Text style={styles.toolPurpose}>{tool.purpose}</Text>
            <Text style={styles.toolCompany}>公司: {tool.company}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <CustomSafeAreaViws top={0}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载工具列表中...</Text>
        </View>
      </CustomSafeAreaViws>
    );
  }

  if (error) {
    return (
      <CustomSafeAreaViws top={0}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTools}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </CustomSafeAreaViws>
    );
  }

  return (
    <CustomSafeAreaViws top={0}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索工具用途..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={Object.keys(groupedTools)}
          renderItem={renderCategory}
          keyExtractor={item => item}
          scrollEnabled={false}
        />

        {filteredTools.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>未找到匹配的AI工具</Text>
          </View>
        )}
      </ScrollView>
    </CustomSafeAreaViws>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
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
    backgroundColor: '#f5f7fa',
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  categoryScrollView: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 25,
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#212529',
  },
  toolCard: {
    backgroundColor: '#fafafa',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  toolHeader: {
    marginBottom: 16,
  },
  toolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 14,
    alignSelf: 'center',
  },
  paidBadgeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
  },
  toolPurpose: {
    fontSize: 15,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 22,
  },
  toolCompany: {
    fontSize: 14,
    color: '#adb5bd',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default AIToolsScreen;