import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import EditWishModal from '../../components/EditWishModal';
import AddWishModal from '../../components/AddWishModal';

// ✅ Fixed category icons
const CATEGORY_ICONS = {
  Food: 'food-fork-drink',
  Travel: 'airplane',
  Health: 'heart-pulse',
  Learning: 'book-open-variant',
  Entertainment: 'movie-open',
  Shopping: 'cart',
  Finance: 'cash',
  Career: 'briefcase',
  Family: 'account-group',
  Spiritual: 'meditation',
  Personal: 'account',
  Others: 'dots-horizontal',
};

const PRIORITY_COLORS = {
  1: '#22c55e',
  2: '#60a5fa',
  3: '#facc15',
  4: '#f97316',
  5: '#ef4444',
};

export default function Wishlist() {
  const [summary, setSummary] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedWish, setSelectedWish] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const _token = await AsyncStorage.getItem('token');
    setToken(_token);
    try {
      const [sumRes, wishRes] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/wishlists/summary`, {
          headers: { Authorization: `Bearer ${_token}` }
        }),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/wishlists`, {
          headers: { Authorization: `Bearer ${_token}` }
        })
      ]);
      setSummary(sumRes.data.summary);
      setWishlist(wishRes.data.wishlists || []);
    } catch (e) {
      Alert.alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = wishlist.filter(w => filter === 'all' || w.status === filter);

  // ✅ Toggle status complete → pending and vice versa
  const handleComplete = async id => {
    const wish = wishlist.find(w => w._id === id);
    if (!wish) return;

    if (wish.status === 'completed') {
      Alert.alert("Mark as pending?", "Do you want to move this back to pending?", [
        { text: 'Cancel' },
        {
          text: 'Yes', onPress: async () => {
            try {
              await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/wishlists/${id}`, { status: 'pending' }, {
                headers: { Authorization: `Bearer ${token}` }
              });
              loadData();
            } catch {
              Alert.alert("Failed to update status");
            }
          }
        }
      ]);
    } else {
      try {
        await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/wishlists/${id}`, { status: 'completed' }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadData();
      } catch {
        Alert.alert("Can't complete");
      }
    }
  };

  const handleDelete = id => {
    Alert.alert("Delete?", "Confirm delete?", [
      { text: 'Cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/wishlists/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            loadData();
          } catch {
            Alert.alert("Delete failed");
          }
        }
      }
    ]);
  };

  const openEdit = async id => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/wishlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedWish(res.data.wishlist);
      setShowEditModal(true);
    } catch {
      Alert.alert("Can't load");
    }
  };

  const renderWish = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleComplete(item._id)}
      onLongPress={() => {
        Alert.alert("Action", "", [
          { text: "Cancel" },
          { text: "Edit", onPress: () => openEdit(item._id) },
          { text: "Delete", onPress: () => handleDelete(item._id), style: 'destructive' },
        ]);
      }}
      style={styles.card}>
      <View style={[styles.priorityIndicator, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
      <MaterialCommunityIcons
        name={CATEGORY_ICONS[item.category] || CATEGORY_ICONS.Others}
        size={24} color="#2563EB" style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc} numberOfLines={2}>{item.notes}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.titleMain}>Wishes</Text>
      <Text style={styles.tagline}>Your dream bucket‑list in one place</Text>

      {summary && (
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Ionicons name="list-circle" size={28} color="#2563EB" />
            <Text style={styles.gridText}>{summary.total} Total</Text>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
            <Text style={styles.gridText}>{summary.completed} Done</Text>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="time-outline" size={28} color="#facc15" />
            <Text style={styles.gridText}>{summary.pending} Pending</Text>
          </View>
          <View style={styles.gridItem}>
            <Ionicons name="close-circle" size={28} color="#ef4444" />
            <Text style={styles.gridText}>{summary.cancelled} Cancelled</Text>
          </View>
        </View>
      )}

      <View style={styles.tabs}>
        {['pending', 'completed'].map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            style={[styles.tab, filter === status && styles.activeTab]}>
            <Text style={{ color: filter === status ? '#fff' : '#374151', fontWeight: '600' }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i._id}
        renderItem={renderWish}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {showEditModal && selectedWish && (
        <EditWishModal
          visible={showEditModal}
          wish={selectedWish}
          onClose={() => setShowEditModal(false)}
          onUpdated={loadData}
        />
      )}

      {showAddModal && (
        <AddWishModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreated={loadData}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
  <Ionicons name="add" size={28} color="#fff" />
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFD', padding: 20 },
  titleMain: { fontSize: 28, fontWeight: '700', color: '#111827' },
  tagline: { color: '#6B7280', marginBottom: 20 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    marginBottom: 20
  },
  gridItem: {
    width: '48%', padding: 15, backgroundColor: '#fff',
    borderRadius: 10, marginBottom: 10,
    alignItems: 'center', elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2
  },
  gridText: { marginTop: 8, fontWeight: '600', color: '#374151' },
  tabs: { flexDirection: 'row', marginBottom: 20 },
  tab: {
    flex: 1, padding: 12, marginRight: 8, borderRadius: 10, backgroundColor: '#E5E7EB', alignItems: 'center'
  },
  activeTab: { backgroundColor: '#2563EB' },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, marginBottom: 12,
    borderRadius: 12, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4
  },
  priorityIndicator: {
    width: 8, height: 50, borderRadius: 4, marginRight: 12
  },
  title: { fontSize: 17, fontWeight: '600', color: '#111827' },
  desc: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  fab: {
    position: 'absolute', right: 25, bottom: 30,
    backgroundColor: '#2563EB', borderRadius: 30, padding: 16,
    elevation: 5,
    shadowColor: '#000', shadowOffset: { width: 1, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4
  }
});
