import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function EditWishModal({ visible, onClose, wish, onUpdated }) {
  const [form, setForm] = useState({ ...wish });
  const [loading, setLoading] = useState(false);

  const updateWish = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/wishlists/${wish._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('✅ Success', 'Wish updated successfully!');
      onUpdated();
      onClose();
    } catch (e) {
      console.error(e.response?.data || e.message);
      Alert.alert('❌ Error', e.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteWish = () => {
    Alert.alert('⚠️ Delete Wish', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(
              `${process.env.EXPO_PUBLIC_API_URL}/wishlist/${wish._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            onUpdated();
            onClose();
          } catch (_) {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalWrap}
        >
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>🎯 Edit Your Wish</Text>

            {['title', 'category', 'description', 'priority', 'notes', 'image_url'].map((key) => (
              <View key={key} style={styles.inputGroup}>
                <Text style={styles.label}>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                <TextInput
                  value={String(form[key] ?? '')}
                  onChangeText={(val) =>
                    setForm({ ...form, [key]: key === 'priority' ? Number(val) : val })
                  }
                  style={styles.input}
                  keyboardType={key === 'priority' ? 'numeric' : 'default'}
                  multiline={['description', 'notes'].includes(key)}
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                  placeholderTextColor="#aaa"
                />
              </View>
            ))}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={updateWish} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="check-circle" size={18} color="#fff" style={styles.icon} />
                    <Text style={styles.btnText}>Update</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={deleteWish}>
                <Ionicons name="trash-outline" size={18} color="#fff" style={styles.icon} />
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalWrap: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  container: {
    padding: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 15,
    color: '#111',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    marginTop: 20,
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
});
