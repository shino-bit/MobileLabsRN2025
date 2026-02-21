import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { LogLevel, OneSignal } from 'react-native-onesignal';

const APP_ID = 'b7ffcc92-3d5b-4f6c-9ecd-7af3df381edb';
const REST_API_KEY = 'os_v2_app_w774zer5lnhwzhwnplz56oa63prdq56vgpsenr47xfvtume2qeyp6kfog4th3fnsvoiyoc3f5yxnxr5kuc6fxueprwbvvltdaz4z7zy';

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(APP_ID);

    OneSignal.Notifications.requestPermission(true);

    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log("Сповіщення у foreground", event);
      event.preventDefault();
      event.notification.display();
    });
  }, []);

  const scheduleNotification = async (taskTitle, taskDesc, taskDate) => {
    const url = 'https://api.onesignal.com/notifications?c=push';
    const sendAfter = new Date(taskDate).toISOString();
    const message = taskDesc ? `${taskTitle}\n${taskDesc}` : taskTitle;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: APP_ID,
          contents: { en: message },
          headings: { en: 'Житомирська політехніка' },
          included_segments: ['Total Subscriptions'], 
          send_after: sendAfter,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Notification sent successfully:', result);
      return result.id; 
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Помилка", "Не вдалося запланувати сповіщення");
      return null;
    }
  };

  const cancelNotification = async (notificationId) => {
    if (!notificationId) return;
    
    const url = `https://api.onesignal.com/notifications/${notificationId}?app_id=${APP_ID}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${REST_API_KEY}`,
        },
      });
      const result = await response.json();
      console.log('Notification canceled:', result);
    } catch (error) {
      console.error("Error canceling notification:", error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      Alert.alert("Увага", "Введіть назву завдання!");
      return;
    }

    const notificationId = await scheduleNotification(title, description, date);

    const newTask = {
      id: Date.now().toString(),
      title: title,
      description: description,
      date: date.toISOString(),
      notificationId: notificationId 
    };

    setTasks([...tasks, newTask]);
    
    setTitle('');
    setDescription('');
    setDate(new Date());
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    
    if (taskToDelete && taskToDelete.notificationId) {
      cancelNotification(taskToDelete.notificationId);
    }
    
    setTasks(tasks.filter(task => task.id !== id));
  };

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
          placeholder="Назва завдання..."
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Опис (необов'язково)..."
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setOpen(true)}>
          <Text style={styles.datePickerText}>
            Обрати час: {date.toLocaleString('uk-UA', { 
              weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </Text>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>ДОДАТИ НАГАДУВАННЯ</Text>
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' },
  formContainer: { paddingHorizontal: 20, marginBottom: 20 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  datePickerBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15 },
  datePickerText: { fontSize: 14, color: '#555' },
  addBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  list: { paddingHorizontal: 20 },
  taskCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  taskInfo: { flex: 1, paddingRight: 10 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  taskDesc: { fontSize: 14, color: '#666', marginBottom: 6 },
  taskDate: { fontSize: 12, color: '#999' },
  deleteBtn: { backgroundColor: '#f44336', padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});