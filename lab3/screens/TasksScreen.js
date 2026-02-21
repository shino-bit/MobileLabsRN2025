import { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import TaskItem from '../components/TaskItem';
import { GameContext } from '../context/GameContext';

export default function TasksScreen() {
  const { tasks } = useContext(GameContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Твої досягнення</Text>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});