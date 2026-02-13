import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: Card[];
  canFlip: boolean;
  moves: number;
  time: number;
  gameStarted: boolean;
  gameOver: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'];

function GameScreen() {
  const navigation = useNavigation();
  const [gameState, setGameState] = React.useState<GameState>({
    cards: [],
    flippedCards: [],
    canFlip: true,
    moves: 0,
    time: 0,
    gameStarted: false,
    gameOver: false,
    difficulty: 'easy',
  });

  React.useEffect(() => {
    let timer: number;
    if (gameState.gameStarted && !gameState.gameOver) {
      timer = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000) as unknown as number;
    }
    return () => clearInterval(timer);
  }, [gameState.gameStarted, gameState.gameOver]);

  const initializeGame = (difficulty: 'easy' | 'medium' | 'hard') => {
    let pairs = 4;
    if (difficulty === 'medium') pairs = 6;
    if (difficulty === 'hard') pairs = 8;

    const selectedEmojis = EMOJIS.slice(0, pairs);
    const cardValues = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    for (let i = cardValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
    }

    const cards: Card[] = cardValues.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }));

    setGameState({
      cards,
      flippedCards: [],
      canFlip: true,
      moves: 0,
      time: 0,
      gameStarted: true,
      gameOver: false,
      difficulty,
    });
  };

  const handleCardPress = (card: Card) => {
    if (!gameState.canFlip || card.flipped || card.matched) return;

    const updatedCards = gameState.cards.map(c => 
      c.id === card.id ? { ...c, flipped: true } : c
    );

    const updatedFlippedCards = [...gameState.flippedCards, card];

    setGameState(prev => ({
      ...prev,
      cards: updatedCards,
      flippedCards: updatedFlippedCards,
    }));

    if (updatedFlippedCards.length === 2) {
      setGameState(prev => ({ ...prev, canFlip: false, moves: prev.moves + 1 }));

      setTimeout(() => {
        const [firstCard, secondCard] = updatedFlippedCards;
        let newCards = [...updatedCards];

        if (firstCard.value === secondCard.value) {
          newCards = newCards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id 
              ? { ...c, matched: true } 
              : c
          );

          // Check if game is over
          const allMatched = newCards.every(c => c.matched);
          if (allMatched) {
            setGameState(prev => ({ ...prev, gameOver: true, gameStarted: false }));
            Alert.alert('恭喜！', `游戏结束\n步数：${gameState.moves + 1}\n时间：${gameState.time}秒`);
          }
        } else {
          newCards = newCards.map(c => 
            c.id === firstCard.id || c.id === secondCard.id 
              ? { ...c, flipped: false } 
              : c
          );
        }

        setGameState(prev => ({
          ...prev,
          cards: newCards,
          flippedCards: [],
          canFlip: true,
        }));
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGridStyle = () => {
    switch (gameState.difficulty) {
      case 'easy':
        return styles.gridEasy;
      case 'medium':
        return styles.gridMedium;
      case 'hard':
        return styles.gridHard;
      default:
        return styles.gridEasy;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!gameState.gameStarted && !gameState.gameOver ? (
        <View style={styles.startScreen}>
          <Text style={styles.startTitle}>选择难度</Text>
          <View style={styles.difficultyButtons}>
            <TouchableOpacity 
              style={[styles.difficultyButton, styles.easyButton]} 
              onPress={() => initializeGame('easy')}
            >
              <Text style={styles.difficultyButtonText}>简单</Text>
              <Text style={styles.difficultySubtext}>4对卡片</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.difficultyButton, styles.mediumButton]} 
              onPress={() => initializeGame('medium')}
            >
              <Text style={styles.difficultyButtonText}>中等</Text>
              <Text style={styles.difficultySubtext}>6对卡片</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.difficultyButton, styles.hardButton]} 
              onPress={() => initializeGame('hard')}
            >
              <Text style={styles.difficultyButtonText}>困难</Text>
              <Text style={styles.difficultySubtext}>8对卡片</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>步数</Text>
              <Text style={styles.statValue}>{gameState.moves}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>时间</Text>
              <Text style={styles.statValue}>{formatTime(gameState.time)}</Text>
            </View>
          </View>

          <View style={[styles.gridContainer, getGridStyle()]}>
            {gameState.cards.map(card => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  card.flipped || card.matched ? styles.cardFlipped : {},
                  card.matched ? styles.cardMatched : {},
                ]}
                onPress={() => handleCardPress(card)}
              >
                <Text style={styles.cardText}>
                  {card.flipped || card.matched ? card.value : '?'}  
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {gameState.gameOver && (
            <Modal
              transparent={true}
              animationType="fade"
              visible={gameState.gameOver}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>游戏结束！</Text>
                  <Text style={styles.modalText}>步数：{gameState.moves}</Text>
                  <Text style={styles.modalText}>时间：{formatTime(gameState.time)}</Text>
                  <TouchableOpacity 
                    style={[styles.restartButton, styles.primaryButton]} 
                    onPress={() => initializeGame(gameState.difficulty)}
                  >
                    <Text style={styles.buttonText}>再玩一次</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.restartButton, styles.secondaryButton]} 
                    onPress={() => setGameState({
                      cards: [],
                      flippedCards: [],
                      canFlip: true,
                      moves: 0,
                      time: 0,
                      gameStarted: false,
                      gameOver: false,
                      difficulty: 'easy',
                    })}
                  >
                    <Text style={[styles.buttonText, { color: '#007AFF' }]}>更换难度</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  difficultyButtons: {
    width: '100%',
    maxWidth: 300,
  },
  difficultyButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#FF9800',
  },
  hardButton: {
    backgroundColor: '#F44336',
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  difficultySubtext: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  gridContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  gridEasy: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridMedium: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridHard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFlipped: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  cardMatched: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  cardText: {
    fontSize: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  restartButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    marginTop: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default GameScreen;