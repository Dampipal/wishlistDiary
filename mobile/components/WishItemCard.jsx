import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WishItemCard({ wish, onPress, onLongPress, onStatusToggle }) {
  const toggleComplete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/wishlist/${wish._id}`,
        { status: wish.status === 'completed' ? 'pending' : 'completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onStatusToggle();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={s.card}>
        <View style={s.row}>
          <Ionicons
            name={wish.status === 'completed' ? 'checkbox' : 'square-outline'}
            size={24}
            color={wish.status === 'completed' ? '#4caf50' : '#777'}
            onPress={toggleComplete}
          />
          <View style={s.text}>
            <Text style={s.title}>{wish.title}</Text>
            <Text numberOfLines={1} style={s.desc}>{wish.description}</Text>
          </View>
        </View>
        <Text style={s.category}>{wish.category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fafafa', padding: 12, marginBottom: 12, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1, marginLeft: 10 },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { color: '#555' },
  category: { alignSelf: 'flex-end', color: '#007bff', fontSize: 12 },
});
