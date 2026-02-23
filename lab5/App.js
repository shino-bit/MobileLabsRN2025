import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Keyboard, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const BASE_DIR = FileSystem.documentDirectory + 'AppData/';

export default function App() {
  const [currentPath, setCurrentPath] = useState(BASE_DIR);
  const [storageInfo, setStorageInfo] = useState({ total: 0, free: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [modalType, setModalType] = useState('folder');
  const [newItemName, setNewItemName] = useState('');

  const [editorVisible, setEditorVisible] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [editingFilePath, setEditingFilePath] = useState('');
  const [editingFileName, setEditingFileName] = useState('');

  const [infoVisible, setInfoVisible] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);

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
      console.log("Не вдалося отримати статистику пам'яті:", e);
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
    setCreateModalVisible(true);
  };

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Увага', 'Введіть назву!');
      return;
    }
    try {
      if (modalType === 'folder') {
        await FileSystem.makeDirectoryAsync(currentPath + newItemName);
      } else {
        const fileName = newItemName.endsWith('.txt') ? newItemName : `${newItemName}.txt`;
        await FileSystem.writeAsStringAsync(currentPath + fileName, 'Новий текстовий файл.\n');
      }
      setCreateModalVisible(false);
      loadDirectory(currentPath);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити елемент.');
    }
  };

  const confirmDelete = (item) => {
    Alert.alert('Підтвердження', `Видалити ${item.isDirectory ? 'папку' : 'файл'} "${item.name}"?`, [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: async () => {
          await FileSystem.deleteAsync(item.path, { idempotent: true });
          loadDirectory(currentPath);
        }
      }
    ]);
  };

  const handlePressItem = async (item) => {
    if (item.isDirectory) {
      setCurrentPath(item.path + '/');
    } else {
      if (item.name.endsWith('.txt')) {
        try {
          const content = await FileSystem.readAsStringAsync(item.path);
          setFileContent(content);
          setEditingFilePath(item.path);
          setEditingFileName(item.name);
          setEditorVisible(true);
        } catch (error) {
          Alert.alert('Помилка', 'Не вдалося прочитати файл');
        }
      } else {
        Alert.alert('Увага', 'Можна редагувати лише .txt файли');
      }
    }
  };

  const saveFile = async () => {
    try {
      Keyboard.dismiss();
      await FileSystem.writeAsStringAsync(editingFilePath, fileContent);
      Alert.alert('Успіх', 'Файл збережено!');
      setEditorVisible(false);
      loadDirectory(currentPath);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл');
    }
  };

  const showFileInfo = async (item) => {
    try {
      const info = await FileSystem.getInfoAsync(item.path);
      const extension = item.isDirectory ? 'Папка' : item.name.split('.').pop().toUpperCase();
      const modDate = new Date(info.modificationTime * 1000).toLocaleString('uk-UA');
      
      setFileInfo({
        name: item.name,
        type: extension,
        size: formatBytes(info.size),
        date: modDate
      });
      setInfoVisible(true);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося отримати інформацію');
    }
  };

  const goBack = () => {
    if (currentPath !== BASE_DIR) {
      setCurrentPath(currentPath.replace(/[^/]+\/$/, ''));
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

  const renderItem = ({ item }) => (
    <View style={styles.fileItem}>
      <TouchableOpacity style={styles.itemLeft} onPress={() => handlePressItem(item)}>
        <MaterialIcons name={item.isDirectory ? "folder" : "insert-drive-file"} size={30} color={item.isDirectory ? "#FFC107" : "#2196F3"} />
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
      </TouchableOpacity>
      
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={() => showFileInfo(item)} style={styles.actionBtn}>
          <MaterialIcons name="info-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.actionBtn}>
          <MaterialIcons name="delete-outline" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
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
        <TouchableOpacity style={[styles.toolbarBtn, {backgroundColor: '#FF9800'}]} onPress={() => openCreateModal('folder')}>
          <MaterialIcons name="create-new-folder" size={20} color="#fff" />
          <Text style={styles.toolbarText}>Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarBtn, {backgroundColor: '#4CAF50'}]} onPress={() => openCreateModal('file')}>
          <MaterialIcons name="note-add" size={20} color="#fff" />
          <Text style={styles.toolbarText}>Новий файл</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.breadcrumb}>
        {currentPath !== BASE_DIR && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.breadcrumbText} numberOfLines={1}>
          Шлях: {currentPath.replace(FileSystem.documentDirectory, '')}
        </Text>
      </View>

      <View style={styles.filesContainer}>
        {isLoading ? <ActivityIndicator size="large" color="#2196F3" /> : 
         files.length === 0 ? <Text style={styles.emptyText}>Папка порожня</Text> : 
         <FlatList data={files} keyExtractor={item => item.path} renderItem={renderItem} contentContainerStyle={{padding: 15}} />}
      </View>

      <Modal visible={createModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Створити {modalType === 'folder' ? 'папку' : 'файл'}</Text>
              <TextInput style={styles.input} placeholder="Введіть назву..." value={newItemName} onChangeText={setNewItemName} autoFocus />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.btn, {backgroundColor: '#ccc'}]} onPress={() => { Keyboard.dismiss(); setCreateModalVisible(false); }}><Text>Скасувати</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {backgroundColor: '#2196F3'}]} onPress={handleCreateItem}><Text style={{color:'#fff'}}>Створити</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={editorVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.editorHeader}>
              <Text style={styles.editorTitle}>Редактор: {editingFileName}</Text>
              {/* Нова іконка для згортання клавіатури */}
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <MaterialIcons name="keyboard-hide" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={styles.editorInput} 
              multiline 
              value={fileContent} 
              onChangeText={setFileContent} 
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, {backgroundColor: '#ccc', margin: 15}]} onPress={() => { Keyboard.dismiss(); setEditorVisible(false); }}><Text>Скасувати</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {backgroundColor: '#4CAF50', margin: 15}]} onPress={saveFile}><Text style={{color:'#fff'}}>Зберегти</Text></TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Властивості</Text>
            {fileInfo && (
              <View style={{marginBottom: 20}}>
                <Text style={styles.infoText}>Назва: <Text style={{fontWeight: 'bold'}}>{fileInfo.name}</Text></Text>
                <Text style={styles.infoText}>Тип: <Text style={{fontWeight: 'bold'}}>{fileInfo.type}</Text></Text>
                <Text style={styles.infoText}>Розмір: <Text style={{fontWeight: 'bold'}}>{fileInfo.size}</Text></Text>
                <Text style={styles.infoText}>Змінено: <Text style={{fontWeight: 'bold'}}>{fileInfo.date}</Text></Text>
              </View>
            )}
            <TouchableOpacity style={[styles.btn, {backgroundColor: '#2196F3', width: '100%'}]} onPress={() => setInfoVisible(false)}>
              <Text style={{color: '#fff'}}>Закрити</Text>
            </TouchableOpacity>
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
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 8 },
  statsText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, marginTop: 10, marginHorizontal: 15 },
  toolbarBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  toolbarText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  breadcrumb: { padding: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#eee' },
  backButton: { marginRight: 15, backgroundColor: '#e0e0e0', padding: 5, borderRadius: 5 },
  breadcrumbText: { fontSize: 14, color: '#333', fontWeight: 'bold', flex: 1 },
  filesContainer: { flex: 1 },
  fileItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  fileName: { fontSize: 16, marginLeft: 15, color: '#333', flex: 1 },
  itemActions: { flexDirection: 'row' },
  actionBtn: { marginLeft: 10, padding: 5 },
  emptyText: { fontSize: 16, color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  editorHeader: { backgroundColor: '#2196F3', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editorTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  editorInput: { flex: 1, padding: 15, fontSize: 16, backgroundColor: '#fafafa' },
  infoText: { fontSize: 16, marginBottom: 8, color: '#333' }
});