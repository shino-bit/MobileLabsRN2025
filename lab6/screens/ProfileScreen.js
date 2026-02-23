import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../AuthContext';
import { auth } from '../firebase';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка виходу", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Це екран Профілю!</Text>
      <Text style={styles.emailText}>Ви увійшли як:</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Вийти з акаунту</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  emailText: { fontSize: 16, color: '#666' },
  email: { fontSize: 18, fontWeight: 'bold', color: '#2196F3', marginBottom: 40 },
  logoutButton: { backgroundColor: '#F44336', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});