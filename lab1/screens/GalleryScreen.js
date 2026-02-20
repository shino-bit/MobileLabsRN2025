import { Ionicons } from '@expo/vector-icons';
import { Dimensions, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';


const galleryData = [
  { id: '1', title: 'Setup V1' },
  { id: '2', title: 'Workplace' },
  { id: '3', title: 'Keyboard' },
  { id: '4', title: 'Monitor' },
  { id: '5', title: 'Code' },
  { id: '6', title: 'Coffee' },
  { id: '7', title: 'Meeting' },
  { id: '8', title: 'Night View' },
];

const windowWidth = Dimensions.get('window').width; 

export default function GalleryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* HEADER (Такий самий як на Home) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.polytechText}>MOONSCRIPT</Text>
          <Text style={styles.subText}>Community Gallery</Text>
        </View>
        <Text style={styles.appName}>MobileApp</Text>
      </View>

      {/* Основна частина - Сітка */}
      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Фотогалерея</Text>
        
        <FlatList
          data={galleryData}
          keyExtractor={item => item.id}
          numColumns={2} 
          columnWrapperStyle={styles.row} 
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.photoPlaceholder}>
              {/* Іконка замість фото */}
              <Ionicons name="image-outline" size={40} color="#333" />
              <Text style={styles.photoText}>{item.title}</Text>
            </View>
          )}
        />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Студент: Отовчиць Ілля, Група ІПЗ-23-4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  polytechText: { color: '#BB86FC', fontWeight: 'bold', fontSize: 18 },
  subText: { color: '#888', fontSize: 12 },
  appName: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  // Content styles
  contentContainer: { flex: 1, paddingHorizontal: 10, paddingTop: 15 },
  pageTitle: { 
    fontSize: 24, 
    color: 'white', 
    marginBottom: 15, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  row: {
    justifyContent: 'space-between', 
  },
  
  // Placeholder
  photoPlaceholder: {
    backgroundColor: '#1E1E1E', 
    width: (windowWidth - 30) / 2, 
    height: 150,
    marginBottom: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333', // Тонка рамка
  },
  photoText: {
    color: '#666',
    marginTop: 10,
    fontSize: 12,
  },

  // Footer styles
  footer: { padding: 15, backgroundColor: '#1E1E1E', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center' },
  footerText: { color: '#888', fontSize: 12, fontStyle: 'italic' },
});