import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const BASE_DIR = FileSystem.documentDirectory + 'AppData/';

export default function App() {
  const [currentPath, setCurrentPath] = useState(BASE_DIR);
  const [files, setFiles] = useState([]);
  const [storageInfo, setStorageInfo] = useState({ total: 0, free: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('folder'); 
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    initApp();
  }, []);

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const initApp = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(BASE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BASE_DIR, { intermediates: true });
      }
      updateStorageInfo();
      setIsLoading(false);
    } catch (error) {
      console.error('Помилка ініціалізації:', error);
      setIsLoading(false);
    }
  };

  const updateStorageInfo = async () => {
    try {
      const freeSpace = await FileSystem.getFreeDiskStorageAsync();
      const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
      setStorageInfo({ total: totalSpace, free: freeSpace });
    } catch (e) {
      console.log("Не вдалося отримати статистику пам'яті");
    }
  };

  const loadDirectory = async (path) => {
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const itemsWithInfo = await Promise.all(
        items.map(async (itemName) => {
          const itemPath = path + itemName;
          const info = await FileSystem.getInfoAsync(itemPath);
          return { name: itemName, isDirectory: info.isDirectory, path: itemPath };
        })
      );
      
      itemsWithInfo.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });

      setFiles(itemsWithInfo);
      updateStorageInfo();
    } catch (error) {
      console.error("Помилка читання директорії:", error);
    }
  };

  const openCreateModal = (type) => {
    setModalType(type);
    setNewItemName('');
    setModalVisible(true);
  };

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Увага', 'Введіть назву!');
      return;
    }

    try {
      if (modalType === 'folder') {
        const folderPath = currentPath + newItemName;
        await FileSystem.makeDirectoryAsync(folderPath);
      } else {
        const fileName = newItemName.endsWith('.txt') ? newItemName : `${newItemName}.txt`;
        const filePath = currentPath + fileName;
        await FileSystem.writeAsStringAsync(filePath, 'Новий текстовий файл.\n', { encoding: FileSystem.EncodingType.UTF8 });
      }
      setModalVisible(false);
      loadDirectory(currentPath); 
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити елемент. Можливо, така назва вже існує.');
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      'Підтвердження',
      `Ви дійсно хочете видалити ${item.isDirectory ? 'папку' : 'файл'} "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', style: 'destructive', onPress: () => deleteItem(item.path) }
      ]
    );
  };

  const deleteItem = async (path) => {
    try {
      await FileSystem.deleteAsync(path, { idempotent: true });
      loadDirectory(currentPath);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося видалити елемент');
    }
  };

  const handlePressItem = (item) => {
    if (item.isDirectory) {
      setCurrentPath(item.path + '/');
    } else {
      Alert.alert("Файл", "Відкриття файлів додамо в наступному кроці!");
    }
  };

  const goBack = () => {
    if (currentPath !== BASE_DIR) {
      const newPath = currentPath.replace(/[^/]+\/$/, '');
      setCurrentPath(newPath);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usedSpace = storageInfo.total > 0 ? storageInfo.total - storageInfo.free : 0;
  const displayPath = currentPath.replace(FileSystem.documentDirectory, '');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handlePressItem(item)}>
      <View style={styles.itemLeft}>
        <MaterialIcons name={item.isDirectory ? "folder" : "insert-drive-file"} size={30} color={item.isDirectory ? "#FFC107" : "#2196F3"} />
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color="#F44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Файловий менеджер</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Всього: {formatBytes(storageInfo.total)}</Text>
          <Text style={styles.statsText}>Вільно: {formatBytes(storageInfo.free)}</Text>
          <Text style={styles.statsText}>Зайнято: {formatBytes(usedSpace)}</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openCreateModal('folder')}>
          <MaterialIcons name="create-new-folder" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#4CAF50'}]} onPress={() => openCreateModal('file')}>
          <MaterialIcons name="note-add" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Новий файл</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.breadcrumb}>
        {currentPath !== BASE_DIR && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.breadcrumbText} numberOfLines={1}> {displayPath}</Text>
      </View>

      <View style={styles.filesContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : files.length === 0 ? (
          <Text style={styles.emptyText}>Папка порожня</Text>
        ) : (
          <FlatList data={files} keyExtractor={(item) => item.path} renderItem={renderItem} contentContainerStyle={styles.listContent} />
        )}
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Створити {modalType === 'folder' ? 'папку' : 'файл'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={modalType === 'folder' ? "Назва папки" : "Назва файлу (напр. note.txt)"}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave]} onPress={handleCreateItem}>
                <Text style={styles.modalBtnTextSave}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 40 },
  header: { backgroundColor: '#2196F3', padding: 20, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, elevation: 4 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 15 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: 8 },
  statsText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', marginTop: 10, marginHorizontal: 15, borderRadius: 10, elevation: 2 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF9800', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  actionButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  breadcrumb: { padding: 15, flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 10, backgroundColor: '#e0e0e0', padding: 5, borderRadius: 5 },
  breadcrumbText: { fontSize: 14, color: '#333', fontWeight: 'bold', flex: 1 },
  filesContainer: { flex: 1 },
  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  fileItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 1 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fileName: { fontSize: 16, marginLeft: 15, color: '#333', flex: 1 },
  deleteButton: { padding: 5 },
  emptyText: { fontSize: 16, color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  modalBtnCancel: { backgroundColor: '#e0e0e0' },
  modalBtnSave: { backgroundColor: '#2196F3' },
  modalBtnText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  modalBtnTextSave: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});