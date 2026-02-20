import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const newsData = [
  { 
    id: '1', 
    title: 'Нічний режим IDE', 
    date: '18.02.2026', 
    text: 'Огляд найкращих тем для VS Code.',
    image: require('../assets/news1.jpg') 
  },
  { 
    id: '2', 
    title: 'Кава vs Енергетики', 
    date: '17.02.2026', 
    text: 'Що краще пити, щоб не заснути?',
    image: require('../assets/news2.jpg')
  },
  { 
    id: '3', 
    title: 'Баг на мільйон', 
    date: '15.02.2026', 
    text: 'Історія про крапку з комою.',
    image: require('../assets/news4.png')
  },
  { 
    id: '4', 
    title: 'React Native оновлення', 
    date: '14.02.2026', 
    text: 'Нова архітектура Fabric.',
    image: require('../assets/news5.png')
  },
  { 
    id: '5', 
    title: 'Музика для кодингу', 
    date: '10.02.2026', 
    text: 'Lo-Fi чи Heavy Metal?',
    image: require('../assets/news3.jpg')
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.polytechText}>MOONSCRIPT</Text>
          <Text style={styles.subText}>Night Coding Forum</Text>
        </View>
        <Text style={styles.appName}>MobileApp</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.pageTitle}>Останні новини</Text>
        
        <FlatList
          data={newsData}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              
              <View style={styles.textContainer}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDate}>{item.date}</Text>
                <Text style={styles.newsText} numberOfLines={2}>
                  {item.text}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Студент: Отовчиць Ілля, Група ІПЗ-23-4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
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
  contentContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 15 },
  pageTitle: { fontSize: 24, color: 'white', marginBottom: 15, fontWeight: 'bold', textAlign: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginBottom: 15,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#333' },
  textContainer: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  newsTitle: { fontSize: 16, fontWeight: 'bold', color: '#E0E0E0', marginBottom: 4 },
  newsDate: { fontSize: 12, color: '#BB86FC', marginBottom: 4 },
  newsText: { fontSize: 13, color: '#AAAAAA', lineHeight: 18 },
  footer: { padding: 15, backgroundColor: '#1E1E1E', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center' },
  footerText: { color: '#888', fontSize: 12, fontStyle: 'italic' },
});