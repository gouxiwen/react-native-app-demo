import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetEnglishwords } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo = {
  bookId: '',
  phrases: [
    {
      p_cn: '自然对流',
      p_content: 'natural convection',
    },
    {
      p_cn: '对流传热',
      p_content: 'convection heat transfer',
    },
    {
      p_cn: '强制对流；人工对流',
      p_content: 'forced convection',
    },
    {
      p_cn: '热对流',
      p_content: 'heat convection',
    },
    {
      p_cn: '[工]对流部分',
      p_content: 'convection section',
    },
    {
      p_cn: '地函对流，地幔对流；地幔对流',
      p_content: 'mantle convection',
    },
    {
      p_cn: '对俩散',
      p_content: 'convection diffusion',
    },
    {
      p_cn: '对流系数，膜层散热系数',
      p_content: 'convection coefficient',
    },
    {
      p_cn: '对流区（等于convective zone）',
      p_content: 'convection zone',
    },
  ],
  relWords: [
    {
      Hwds: [
        {
          hwd: 'convector',
          tran: ' 对流式暖房器；对流散热器；[建] 换流器',
        },
      ],
      Pos: 'n',
    },
    {
      Hwds: [
        {
          hwd: 'convect',
          tran: ' 对流传热',
        },
      ],
      Pos: 'vi',
    },
    {
      Hwds: [
        {
          hwd: 'convect',
          tran: ' 使热空气对流',
        },
      ],
      Pos: 'vt',
    },
  ],
  sentences: [
    {
      s_cn: '...云层通过对流把温暖湿润的空气送到高的大气层中。',
      s_content:
        '...clouds which lift warm, moist air by convection high into the atmosphere.',
    },
  ],
  synonyms: [
    {
      Hwds: [
        {
          word: 'transmission',
        },
        {
          word: 'convective flow',
        },
      ],
      pos: 'n',
      tran: '[流][气象]对流；传送',
    },
  ],
  translations: [
    {
      pos: 'n',
      tran_cn: '[流][气象] 对流；传送',
    },
  ],
  ukphone: "kən'vekʃ(ə)n",
  ukspeech: 'https://dict.youdao.com/dictvoice?audio=convection&type=1',
  usphone: "kən'vɛkʃən",
  usspeech: 'https://dict.youdao.com/dictvoice?audio=convection&type=2',
  word: 'convection',
};
function DailyEnglishScreen() {
  const [loading, setLoading] = React.useState(false);
  const [englishwords, setEnglishwords] = React.useState<any>(defaultInfo);
  const soundRef = React.useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = React.useState(false);
  const [loadingUrl, setLoadingUrl] = React.useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(null);

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
              soundRef.current.release();
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
      setIsLoadingAudio(true);
      setLoadingUrl(url || null);
      // @ts-ignore
      const RNSoundModule = require('react-native-sound');
      // @ts-ignore
      const RNSound = RNSoundModule && (RNSoundModule.default || RNSoundModule);
      if (!RNSound) {
        setIsLoadingAudio(false);
        Linking.openURL(url);
        return;
      }
      if (soundRef.current) {
        try {
          soundRef.current.release();
        } catch {}
        soundRef.current = null;
      }
      const sound = new RNSound(url, '', (err: any) => {
        setIsLoadingAudio(false);
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
      setIsLoadingAudio(false);
      setLoadingUrl(null);
      Linking.openURL(url);
    }
  };

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
  const getEnglishwords = async () => {
    setLoading(true);
    const res = await fetchGetEnglishwords();
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).text, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setEnglishwords(res.data);
    else setEnglishwords(defaultInfo);
  };
  React.useEffect(() => {
    getEnglishwords();
  }, []);

  if (loading || isLoadingAudio)
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
        <View style={styles.englishwords}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.wordTitle}>{englishwords?.word ?? '--'}</Text>
            </View>
            <View style={styles.phonetics}>
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
            </View>

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
                style={styles.rememberBtn}
                activeOpacity={0.8}
                onPress={() =>
                  Toast.showWithGravity(
                    '已标记为已学',
                    Toast.SHORT,
                    Toast.BOTTOM,
                  )
                }
              >
                <Text style={styles.rememberText}>记住</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextBtn}
                activeOpacity={0.8}
                onPress={getEnglishwords}
              >
                <Text style={styles.nextText}>下一词</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  englishwords: {
    width: '90%',
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
  time: {
    backgroundColor: '#F0F5FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
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
});

export default DailyEnglishScreen;
