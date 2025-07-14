import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WishDetail() {
  const { id } = useSearchParams();
  const router = useRouter();

  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWish = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/wishlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setWish(res.data);
    setLoading(false);
  };

  const handleDelete = async () => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes Delete',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/wishlist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          router.back();
        },
      },
    ]);
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/wishlist/${id}`, wish, { headers: { Authorization: `Bearer ${token}` } });
    Alert.alert('Updated', 'Wishlist saved');
    router.back();
  };

  useEffect(() => { fetchWish(); }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={wish.title} onChangeText={t => setWish({ ...wish, title: t })} style={styles.input} />

      <Text style={styles.label}>Category</Text>
      <TextInput value={wish.category} onChangeText={t => setWish({ ...wish, category: t })} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput value={wish.description} onChangeText={t => setWish({ ...wish, description: t })} style={styles.input} multiline />

      <Text style={styles.label}>Priority (1–5)</Text>
      <TextInput value={String(wish.priority)} onChangeText={t => setWish({ ...wish, priority: Number(t) })} style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Notes</Text>
      <TextInput value={wish.notes} onChangeText={t => setWish({ ...wish, notes: t })} style={styles.input} multiline />

      <View style={styles.buttonRow}>
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Delete" onPress={handleDelete} color="#ff3333" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  label: { fontWeight: '600', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 6 },
  buttonRow: { marginTop: 24, flexDirection: 'row', justifyContent: 'space-between' },
});
