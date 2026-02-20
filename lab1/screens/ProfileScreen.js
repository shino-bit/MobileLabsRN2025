import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={styles.header}>
        <View>
          <Text style={styles.polytechText}>MOONSCRIPT</Text>
          <Text style={styles.subText}>User Profile</Text>
        </View>
        <Text style={styles.appName}>MobileApp</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
                <Ionicons name="person" size={60} color="#121212" />
            </View>
            <Text style={styles.username}>@night_coder</Text>
            <Text style={styles.status}>Online • Visual Studio Code</Text>
        </View>

        <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Інформація користувача</Text>
            
            <View style={styles.infoRow}>
                <Ionicons name="id-card-outline" size={20} color="#BB86FC" style={styles.icon} />
                <View>
                    <Text style={styles.label}>Отовчиць Ілля</Text>
                    <Text style={styles.value}>Отовчиць Ілля</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={20} color="#BB86FC" style={styles.icon} />
                <View>
                    <Text style={styles.label}>Група</Text>
                    <Text style={styles.value}>ІПЗ-23-4</Text>
                </View>
            </View>
        </View>

        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>42</Text>
                <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statLine} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>1,337</Text>
                <Text style={styles.statLabel}>Reputation</Text>
            </View>
        </View>

      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Logged in as UserID: 0x5F3A</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  // Header
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

  // Content
  content: { flex: 1, padding: 20, alignItems: 'center' },

  // Avatar Section
  avatarContainer: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#BB86FC', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 10,
    shadowColor: "#BB86FC",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  username: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  status: { color: '#4CAF50', fontSize: 14, marginTop: 5 }, // Зелений статус

  // Info Card
  infoCard: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: { color: '#888', marginBottom: 15, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  icon: { marginRight: 15 },
  label: { color: '#888', fontSize: 12 },
  value: { color: 'white', fontSize: 18, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 10, marginLeft: 35 },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12 },
  statLine: { width: 1, backgroundColor: '#333' },

  // Footer
  footer: { padding: 15, backgroundColor: '#1E1E1E', borderTopWidth: 1, borderTopColor: '#333', alignItems: 'center' },
  footerText: { color: '#555', fontSize: 12, fontFamily: 'monospace' },
});