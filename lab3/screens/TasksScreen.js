import { StyleSheet, Text, View } from 'react-native';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Екран завдань</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});