import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../AuthContext';
import { auth, db } from '../firebase';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setAge(data.age || '');
          setCity(data.city || '');
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        Alert.alert('Помилка', 'Не вдалося завантажити дані профілю');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        name: name,
        age: age,
        city: city
      }, { merge: true }); 
      
      Alert.alert('Успіх', 'Ваш профіль успішно збережено!');
    } catch (error) {
      console.error("Помилка збереження:", error);
      Alert.alert('Помилка збереження', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Помилка виходу", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Мій Профіль</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Ім'я:</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть ваше ім'я"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Вік:</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть ваш вік"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Місто:</Text>
          <TextInput
            style={styles.input}
            placeholder="Введіть ваше місто"
            value={city}
            onChangeText={setCity}
          />

          {saving ? (
            <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 15 }} />
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Зберегти дані</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Вийти з акаунту</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center', paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  email: { fontSize: 16, color: '#666', marginBottom: 30 },
  form: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: 'transparent', padding: 15, marginTop: 'auto', marginBottom: 20 },
  logoutText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' }
});