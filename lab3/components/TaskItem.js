import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function TaskItem({ task }) {
  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <View style={styles.info}>
        <Text style={[styles.text, task.completed && styles.completedText]}>
          {task.text}
        </Text>
        <Text style={styles.progress}>
          Прогрес: {task.current} / {task.goal}
        </Text>
      </View>
      {task.completed ? (
        <Ionicons name="checkmark-circle" size={24} color="green" />
      ) : (
        <Ionicons name="ellipse-outline" size={24} color="#ccc" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#e8f5e9',
  },
  info: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  progress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});