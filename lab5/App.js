import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BASE_DIR = FileSystem.documentDirectory + 'AppData/';

export default function App() {
  const [currentPath, setCurrentPath] = useState(BASE_DIR);
  const [storageInfo, setStorageInfo] = useState({ total: 0, free: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [files, setFiles] = useState([]);

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
        console.log('Папку AppData успішно створено!');
      }

      try {
        const freeSpace = await FileSystem.getFreeDiskStorageAsync();
        const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
        setStorageInfo({ total: totalSpace, free: freeSpace });
      } catch (e) {
        console.log("Не вдалося отримати статистику пам'яті:", e);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Помилка ініціалізації:', error);
      setIsLoading(false);
    }
  };


  const loadDirectory = async (path) => {
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const itemsWithInfo = await Promise.all(
        items.map(async (itemName) => {
          const itemPath = path + itemName;
          const info = await FileSystem.getInfoAsync(itemPath);
          return {
            name: itemName,
            isDirectory: info.isDirectory,
            path: itemPath,
          };
        })
      );
      
 
      itemsWithInfo.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });

      setFiles(itemsWithInfo);
    } catch (error) {
      console.error("Помилка читання директорії:", error);
    }
  };

 
  const handlePressItem = (item) => {
    if (item.isDirectory) {
      setCurrentPath(item.path + '/');
    } else {
      console.log("Клікнули на файл:", item.name);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handlePressItem(item)}>
      <MaterialIcons 
        name={item.isDirectory ? "folder" : "insert-drive-file"} 
        size={30} 
        color={item.isDirectory ? "#FFC107" : "#2196F3"} 
      />
      <Text style={styles.fileName}>{item.name}</Text>
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

      <View style={styles.breadcrumb}>
        {currentPath !== BASE_DIR && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#333" />
            <Text style={styles.backText}>Назад</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.breadcrumbText} numberOfLines={1}>
          Шлях: {currentPath.replace(FileSystem.documentDirectory, '')}
        </Text>
      </View>

      <View style={styles.filesContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : files.length === 0 ? (
          <Text style={styles.emptyText}>Папка порожня</Text> 
        ) : (
          <FlatList
            data={files}
            keyExtractor={(item) => item.path}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            style={{ width: '100%' }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40, 
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 8,
  },
  statsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  breadcrumb: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row', 
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  backText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  filesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  listContent: {
    padding: 15,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  fileName: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
});