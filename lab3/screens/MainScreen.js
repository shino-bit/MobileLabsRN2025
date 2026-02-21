import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ClickerObject from '../components/ClickerObject';
import { GameContext } from '../context/GameContext';

export default function MainScreen() {
  const { score } = useContext(GameContext);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Твої очки:</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      
      <ClickerObject />
      
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>1 клік = 1 очко</Text>
        <Text style={styles.hintText}>Подвійний клік = 2 очки</Text>
        <Text style={styles.hintText}>Утримуй 3с = 10 очок</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly', 
    paddingVertical: 50,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  hintContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
  },
  hintText: {
    color: '#555',
    fontSize: 16,
    marginVertical: 4,
  },
});