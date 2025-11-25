import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Sound from 'react-native-sound';
import { fetchGetEnglishwords } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor, rememberedWordKey } from '../common/const';
import { removeData, getData, storeData } from '../common/utils';

type englishwordsType = {
  bookId: string;
  phrases: {
    p_cn: string;
    p_content: string;
  }[];
  relWords: {
    Hwds: {
      hwd: string;
      tran: string;
    }[];
    Pos: string;
  }[];
  sentences: {
    s_cn: string;
    s_content: string;
  }[];
  synonyms: {
    Hwds: {
      word: string;
    }[];
    pos: string;
    tran: string;
  }[];
  translations: {
    pos: string;
    tran_cn: string;
  }[];
  ukphone: string;
  ukspeech: string;
  usphone: string;
  usspeech: string;
  word: string;
};

function CardHeader({
  englishwords,
}: {
  englishwords: englishwordsType | null;
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [loadingUrl, setLoadingUrl] = React.useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);
  const soundRef = React.useRef<Sound | null>(null);
  React.useEffect(() => {
    return () => {
      if (soundRef.current) {
        try {
          soundRef.current.release();
        } catch {}
        soundRef.current = null;
      }
    };
  }, []);

  const playAudio = (url?: string) => {
    if (!url) return;
    // same url: toggle pause/resume
    if (currentUrl === url && soundRef.current) {
      try {
        if (isPlaying) {
          soundRef.current.pause();
          setIsPlaying(false);
        } else {
          soundRef.current.play(() => {
            try {
              soundRef.current?.release();
            } catch {}
            setIsPlaying(false);
            setCurrentUrl(null);
          });
          setIsPlaying(true);
        }
      } catch {
        Linking.openURL(url);
      }
      return;
    }

    // different url: release previous and play new
    try {
      setLoadingUrl(url || null);
      if (!Sound) {
        Linking.openURL(url);
        return;
      }
      if (soundRef.current) {
        try {
          soundRef.current.release();
        } catch {}
        soundRef.current = null;
      }
      const sound = new Sound(url, '', (err: any) => {
        setLoadingUrl(null);
        if (err) {
          Linking.openURL(url);
          return;
        }
        soundRef.current = sound;
        setCurrentUrl(url);
        setIsPlaying(true);
        sound.play(() => {
          try {
            sound.release();
          } catch {}
          soundRef.current = null;
          setIsPlaying(false);
          setCurrentUrl(null);
        });
      });
    } catch {
      setLoadingUrl(null);
      Linking.openURL(url);
    }
  };
  return (
    <>
      <View style={styles.cardHeader}>
        <Text style={styles.wordTitle}>{englishwords?.word ?? '--'}</Text>
      </View>
      <View style={styles.phonetics}>
        {englishwords?.ukphone && (
          <>
            <Text style={styles.phoneticText}>
              {englishwords?.ukphone ?? ''}
            </Text>
            <TouchableOpacity
              onPress={() => playAudio(englishwords?.ukspeech)}
              style={styles.playBtn}
            >
              {loadingUrl === englishwords?.ukspeech ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : isPlaying && currentUrl === englishwords?.ukspeech ? (
                <Text style={styles.playText}>■</Text>
              ) : (
                <Text style={styles.playText}>▶</Text>
              )}
            </TouchableOpacity>
          </>
        )}
        {englishwords?.usphone && (
          <>
            <Text style={[styles.phoneticText, { marginLeft: 8 }]}>
              {englishwords?.usphone ?? ''}
            </Text>
            <TouchableOpacity
              onPress={() => playAudio(englishwords?.usspeech)}
              style={[styles.playBtn, { marginLeft: 6 }]}
            >
              {loadingUrl === englishwords?.usspeech ? (
                <ActivityIndicator size="small" color={primaryColor} />
              ) : isPlaying && currentUrl === englishwords?.usspeech ? (
                <Text style={styles.playText}>■</Text>
              ) : (
                <Text style={styles.playText}>▶</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}
function DailyEnglishScreen() {
  const [loading, setLoading] = React.useState(false);
  const [englishwords, setEnglishwords] =
    React.useState<englishwordsType | null>(null);

  const getEnglishwords = async () => {
    setEnglishwords(null);
    setLoading(true);
    const res = await fetchGetEnglishwords();
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).text, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setEnglishwords(res.data);
  };

  const rememberWord = async () => {
    if (!englishwords) return;
    const rememberedWordsMap = ((await getData(rememberedWordKey)) ||
      {}) as Record<string, englishwordsType>;
    if (rememberedWordsMap[englishwords.word]) return;
    rememberedWordsMap[englishwords.word] = englishwords;
    await storeData(rememberedWordKey, rememberedWordsMap);
  };

  const removeRememberedWord = async (word: string) => {
    const rememberedWordsMap = ((await getData(rememberedWordKey)) ||
      {}) as Record<string, englishwordsType>;
    if (rememberedWordsMap[word]) {
      delete rememberedWordsMap[word];
      await storeData(rememberedWordKey, rememberedWordsMap);
      setRememberedWords(rememberedWordsMap);
      Toast.showWithGravity('已移除', Toast.SHORT, Toast.BOTTOM);
    }
  };
  const removeAllRememberedWord = async () => {
    Alert.alert('确认清空已学单词吗？', '', [
      {
        text: '取消',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: '确定',
        onPress: async () => {
          setLoading(true);
          await removeData(rememberedWordKey);
          setRememberedWords({});
          setLoading(false);
          Toast.showWithGravity('已清空', Toast.SHORT, Toast.BOTTOM);
        },
      },
    ]);
  };

  const [rememberedWords, setRememberedWords] = React.useState<
    Record<string, englishwordsType>
  >({});
  const getRememberedWords = async () => {
    const rememberedWordsMap = ((await getData(rememberedWordKey)) ||
      {}) as Record<string, englishwordsType>;
    setRememberedWords(rememberedWordsMap);
  };

  React.useEffect(() => {
    getEnglishwords();
    getRememberedWords();
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
      <View style={styles.englishwords}>
        <View style={styles.card}>
          <CardHeader englishwords={englishwords} />
          {englishwords?.translations?.length
            ? englishwords.translations.map((t: any, idx: number) => (
                <Text key={idx} style={styles.translation}>{`${t.pos || ''} ${
                  t.tran_cn || ''
                }`}</Text>
              ))
            : null}

          {englishwords?.phrases?.length ? (
            <View style={styles.phrases}>
              {englishwords.phrases.slice(0, 3).map((p: any, i: number) => (
                <View key={i} style={styles.phraseRow}>
                  <Text style={styles.phraseCn}>{p.p_cn}</Text>
                  <Text style={styles.phraseEn}>{p.p_content}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {englishwords?.sentences?.length ? (
            <View style={styles.sentenceBox}>
              <Text style={styles.sentenceEn}>
                {englishwords.sentences[0]?.s_content}
              </Text>
              <Text style={styles.sentenceCn}>
                {englishwords.sentences[0]?.s_cn}
              </Text>
            </View>
          ) : null}
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.nextBtn}
              activeOpacity={0.8}
              onPress={getEnglishwords}
            >
              <Text style={styles.nextText}>下一词</Text>
            </TouchableOpacity>
            {englishwords?.word && !rememberedWords[englishwords.word] && (
              <TouchableOpacity
                style={styles.rememberBtn}
                activeOpacity={0.8}
                onPress={async () => {
                  await rememberWord();
                  Toast.showWithGravity(
                    '已标记为已学',
                    Toast.SHORT,
                    Toast.BOTTOM,
                  );
                  getRememberedWords();
                }}
              >
                <Text style={styles.rememberText}>记住</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.listWrap}>
        <View style={styles.listHeader}>
          <Text style={[styles.title]}>
            已学单词（{Object.keys(rememberedWords).length}）
          </Text>
          {Object.keys(rememberedWords).length > 0 && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeAllRememberedWord()}
            >
              <Text style={styles.removeText}>清空</Text>
            </TouchableOpacity>
          )}
        </View>
        {Object.keys(rememberedWords).length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          >
            {Object.values(rememberedWords)
              .reverse()
              .map(w => (
                <View key={w.word} style={styles.rememberedCard}>
                  <Text style={styles.rememberedWordTitle}>{w.word}</Text>
                  <CardHeader englishwords={w} />
                  <Text style={styles.rememberedMeta} numberOfLines={1}>
                    {w.translations && w.translations[0]
                      ? w.translations[0].tran_cn
                      : ''}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeRememberedWord(w.word)}
                  >
                    <Text style={styles.removeText}>移除</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        ) : (
          <Text style={{ color: '#9aa4b2', marginLeft: 12 }}>暂无已学单词</Text>
        )}
      </View>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  englishwords: {
    backgroundColor: primaryColor,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listHeader: {
    backgroundColor: '#F0F5FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    color: primaryColor,
  },
  context: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    color: primaryColor,
  },

  card: {
    width: '99%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#08121a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ftime: {
    color: primaryColor,
    fontWeight: '700',
    fontSize: 14,
  },
  timeText: {
    color: '#7a8692',
    fontSize: 12,
  },
  word: {
    color: '#223344',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rememberBtn: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rememberText: {
    color: primaryColor,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
  playSpinner: {
    marginLeft: 4,
  },
  wordTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b2130',
  },
  phonetics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneticText: {
    color: '#6b7a86',
    fontSize: 12,
  },
  playBtn: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },
  playText: {
    color: primaryColor,
    fontSize: 12,
    fontWeight: '700',
  },
  translation: {
    color: '#344955',
    fontSize: 14,
    marginTop: 6,
  },
  phrases: {
    marginTop: 10,
  },
  phraseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  phraseCn: {
    color: '#223344',
    fontSize: 13,
    flex: 1,
  },
  phraseEn: {
    color: '#6b7a86',
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  sentenceBox: {
    marginTop: 12,
    backgroundColor: '#FBFCFE',
    padding: 10,
    borderRadius: 8,
  },
  sentenceEn: {
    color: '#0b2130',
    fontSize: 14,
  },
  sentenceCn: {
    color: '#7a8692',
    fontSize: 13,
    marginTop: 6,
  },
  listWrap: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  list: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  rememberedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  rememberedWordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0b2130',
    marginBottom: 6,
  },
  rememberedMeta: {
    fontSize: 12,
    color: '#6b7a86',
    marginBottom: 8,
  },
  removeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeText: {
    color: '#d94a4a',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DailyEnglishScreen;
