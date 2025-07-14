import { useState } from 'react';
import {
  Modal, View, Text, TextInput,
  TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const CATS = ['Food','Travel','Health','Learning','Work','Finance','Fitness','Hobby','Family','Other'];

export default function AddWishModal({ visible, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(3);

  const submit = async () => {
    if (!title) return Alert.alert("Enter title");
    const t = title.trim().replace(/\b\w/g, l => l.toUpperCase());
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/wishlists`, {
        title: t, category: category || 'Other',
        notes, priority, status:'pending'
      }, { headers:{ Authorization:`Bearer ${token}` } });
      onClose(); onCreated();
      setTitle(''); setCategory(''); setNotes(''); setPriority(3);
    } catch { Alert.alert("Failed to add"); }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <View style={m.box}>
          <Text style={m.hdr}>+ New Wish</Text>
          <TextInput placeholder="Title" style={m.input} value={title} onChangeText={setTitle} />
          
          <Text style={m.label}>Category</Text>
          <View style={m.catRow}>
            {CATS.map(c => (
              <TouchableOpacity
                key={c}
                style={[m.catBtn, category === c && m.catActive]}
                onPress={() => setCategory(c)}>
                <Text style={{ color: category===c?'#fff':'#374151' }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={m.label}>Priority</Text>
          <View style={m.prioRow}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity key={n} onPress={() => setPriority(n)}>
                <Ionicons
                  name={n <= priority ? 'star' : 'star-outline'}
                  size={24} color={PRIORITY_COLORS[n]}
                  style={{ marginHorizontal:4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput placeholder="Notes" style={[m.input, { height:80 }]} value={notes} onChangeText={setNotes} multiline />

          <View style={m.actions}>
            <TouchableOpacity onPress={onClose}><Text style={m.cancel}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity onPress={submit} style={m.saveBtn}><Text style={{ color:'#fff' }}>Save</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const PRIORITY_COLORS = {
  1:'#22c55e',2:'#60a5fa',3:'#facc15',4:'#f97316',5:'#ef4444'
};

const m = StyleSheet.create({
  overlay:{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center' },
  box:{ margin:20,padding:20,backgroundColor:'#fff',borderRadius:12 },
  hdr:{ fontSize:20,fontWeight:'700',marginBottom:12 },
  label:{ marginTop:12,fontWeight:'600' },
  input:{ borderWidth:1,borderColor:'#E5E7EB',borderRadius:8,padding:10,marginTop:6 },
  catRow:{ flexDirection:'row',flexWrap:'wrap',marginTop:6 },
  catBtn:{ padding:8,borderRadius:8,backgroundColor:'#E5E7EB',margin:4 },
  catActive:{ backgroundColor:'#2563EB' },
  prioRow:{ flexDirection:'row',marginTop:6 },
  actions:{ flexDirection:'row',justifyContent:'flex-end',marginTop:20 },
  cancel:{ marginRight:20, color:'#374151' },
  saveBtn:{ backgroundColor:'#2563EB', paddingHorizontal:15,paddingVertical:10, borderRadius:8 }
});
