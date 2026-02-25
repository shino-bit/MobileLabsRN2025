import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../AuthContext';
import { auth, db } from '../firebase';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext); 
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordForDeletion, setPasswordForDeletion] = useState('');
  const [deleting, setDeleting] = useState(false);

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
        console.error(error);
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
      await setDoc(docRef, { name, age, city }, { merge: true });
      Alert.alert('Успіх', 'Ваш профіль успішно збережено!');
    } catch (error) {
      Alert.alert('Помилка збереження', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordForDeletion) {
      Alert.alert('Помилка', 'Введіть пароль для підтвердження.');
      return;
    }

    if (!auth.currentUser) {
       Alert.alert('Помилка', 'Користувач не знайдений. Спробуйте вийти і зайти знову.');
       return;
    }

    setDeleting(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, passwordForDeletion);

      await reauthenticateWithCredential(auth.currentUser, credential);

      const docRef = doc(db, 'users', user.uid);
      await deleteDoc(docRef);

      await deleteUser(auth.currentUser);
      
      Alert.alert('Успіх', 'Ваш акаунт було назавжди видалено.');
    } catch (error) {
      console.error(error);
      Alert.alert('Помилка', 'Неправильний пароль або сталася помилка.');
    } finally {
      setDeleting(false);
      setModalVisible(false);
      setPasswordForDeletion('');
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
          <TextInput style={styles.input} placeholder="Введіть ваше ім'я" value={name} onChangeText={setName} />

          <Text style={styles.label}>Вік:</Text>
          <TextInput style={styles.input} placeholder="Введіть ваш вік" value={age} onChangeText={setAge} keyboardType="numeric" />

          <Text style={styles.label}>Місто:</Text>
          <TextInput style={styles.input} placeholder="Введіть ваше місто" value={city} onChangeText={setCity} />

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

        <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.deleteText}>Видалити акаунт</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Видалення акаунту</Text>
              <Text style={styles.modalText}>Ця дія незворотня. Для підтвердження введіть ваш пароль:</Text>
              
              <TextInput 
                style={styles.modalInput} 
                placeholder="Ваш пароль" 
                secureTextEntry 
                value={passwordForDeletion} 
                onChangeText={setPasswordForDeletion} 
              />
              
              {deleting ? (
                <ActivityIndicator size="large" color="#F44336" style={{ marginVertical: 10 }} />
              ) : (
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalCancelText}>Скасувати</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalConfirm} onPress={handleDeleteAccount}>
                    <Text style={styles.modalConfirmText}>Видалити</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center', paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  email: { fontSize: 16, color: '#666', marginBottom: 30 },
  form: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 25 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: 'transparent', padding: 10, marginTop: 'auto' },
  logoutText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  deleteButton: { backgroundColor: 'transparent', padding: 10, marginBottom: 20 },
  deleteText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#F44336', marginBottom: 10 },
  modalText: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 15 },
  modalInput: { width: '100%', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalCancel: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#eee', borderRadius: 8, marginRight: 5 },
  modalCancelText: { color: '#333', fontWeight: 'bold' },
  modalConfirm: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#F44336', borderRadius: 8, marginLeft: 5 },
  modalConfirmText: { color: '#fff', fontWeight: 'bold' }
});