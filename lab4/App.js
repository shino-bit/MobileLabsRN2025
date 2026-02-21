import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import DatePicker from 'react-native-date-picker';

export default function App() {
  // Стейт для полів вводу
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Стейт для вибору дати та відображення модального вікна
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  
  // Стейт для списку завдань
  const [tasks, setTasks] = useState([]);

  // Функція додавання нового завдання
  const addTask = () => {
    if (!title.trim()) return; // Перевірка, щоб не додати пусту назву

    const newTask = {
      id: Date.now().toString(),
      title: title,
      description: description,
      date: date.toISOString(), 
    };

    setTasks([...tasks, newTask]);
    
    // Очищаємо поля після додавання
    setTitle('');
    setDescription('');
    setDate(new Date());
  };

  // Функція видалення завдання
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Компонент для відображення однієї картки завдання
  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.taskDesc}>{item.description}</Text> : null}
        <Text style={styles.taskDate}>
          {new Date(item.date).toLocaleString('uk-UA', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>📝 To-Do Reminder</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Назва"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Опис"
          value={description}
          onChangeText={setDescription}
        />

        {/* Кнопка виклику DatePicker */}
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setOpen(true)}>
          <Text style={styles.datePickerText}>
            Обрати час: {date.toLocaleString('uk-UA', { 
              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </Text>
        </TouchableOpacity>

        {/* Модальне вікно вибору дати */}
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={(selectedDate) => {
            setOpen(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          title="Оберіть час нагадування"
          confirmText="Підтвердити"
          cancelText="Скасувати"
        />

        {/* Кнопка збереження */}
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>ДОДАТИ НАГАДУВАННЯ</Text>
        </TouchableOpacity>
      </View>

      {/* Список завдань */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderTask}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  datePickerBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 14,
    color: '#555',
  },
  addBtn: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskInfo: {
    flex: 1,
    paddingRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  taskDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});