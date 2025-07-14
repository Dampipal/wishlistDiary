import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SummaryCard({ summary, onRefresh }) {
  return (
    <View style={s.card}>
      <Text style={s.title}>Your Wishlist Summary</Text>
      <Text>Total: {summary.total}</Text>
      <Text>Completed: {summary.completed}</Text>
      <Text>Pending: {summary.pending}</Text>
      <Text>Cancelled: {summary.cancelled}</Text>
      <TouchableOpacity onPress={onRefresh} style={s.refresh}>
        <Text style={s.refreshText}>Refresh 🔄</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: { fontWeight: '600', marginBottom: 8 },
  refresh: { marginTop: 8 },
  refreshText: { color: '#007bff' },
});
