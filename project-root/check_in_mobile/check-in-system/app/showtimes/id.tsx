import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



interface Seat {
  id: string;
  row: string;
  col: number;
  reserved: boolean;
  status: 'VALID' | 'CHECKED' | 'CANCELLED' | 'REFUNDED' | 'AVAILABLE';
}

export default function ShowDetailScreen() {
    const { showId } = useLocalSearchParams<{ showId: string }>();
    const { id } = useLocalSearchParams(); // show ID
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    if (!showId) return;
    axios
      .get<Seat[]>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/showtimes/id/seats?showId=${showId}`)
      .then((res) => setSeats(res.data))
      .catch((err) => console.error('Failed to load seats', err));
  }, [showId]);
    useFocusEffect(
        useCallback(() => {
        if (!showId) return;
    
        axios
            .get<Seat[]>(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/showtimes/id/seats?showId=${showId}`)
            .then((res) => setSeats(res.data))
            .catch((err) => console.error('Failed to refresh seats', err));
        }, [showId])
    );

  const getSeatKey = (seat: Seat) => `${seat.row}${seat.col}`;

  const toggleSelect = (seatKey: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatKey)
        ? prev.filter((s) => s !== seatKey)
        : [...prev, seatKey]
    );
  };

  const getSeatStyle = (seat: Seat) => {
    const seatKey = getSeatKey(seat);
    const isSelected = selectedSeats.includes(seatKey);

    if (seat.status === 'CHECKED') return styles.checked;
    if (seat.status === 'VALID') return styles.valid;
    if (seat.status === 'CANCELLED' || seat.status === 'REFUNDED' || seat.status === 'AVAILABLE') {
      return isSelected ? styles.selected : styles.available;
    }
    return styles.available;
  };

  const uniqueRows = [...new Set(seats.map((s) => s.row))];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Seat Map</Text>

      {/* Legend  */}
      <View style={styles.legendRow}>
        <Legend color="#E0E0E0" label="Available" />
        <Legend color="#FFC107" label="Sold (VALID)" />
        <Legend color="#4CAF50" label="Checked-in" />
        <Legend color="#2196F3" label="Selected" />
      </View>

      {/* Seat map */}
      {uniqueRows.map((row) => (
        <View key={row} style={styles.row}>
          {seats
            .filter((s) => s.row === row)
            .map((seat) => {
              const seatKey = getSeatKey(seat);
              const disabled = seat.status === 'VALID' || seat.status === 'CHECKED';
              return (
                <Pressable
                  key={seat.id}
                  onPress={() => {
                    if (!disabled) toggleSelect(seatKey);
                  }}
                  style={[styles.seat, getSeatStyle(seat)]}
                >
                  <Text style={styles.seatText}>{seat.row}{seat.col}</Text>
                </Pressable>
              );
            })}
        </View>
      ))}
      <View style={{ marginTop: 32 }}>
      <Button title="Scan QR Code" onPress={() => router.push({ pathname: '/QRScannerScreen', params: { id: showId } })} />

      </View>
    </ScrollView>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: color }]} />
      <Text style={{ fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 6,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 10,
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: {
    fontSize: 10,
  },
  available: {
    backgroundColor: '#E0E0E0',
  },
  valid: {
    backgroundColor: '#FFC107',
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  selected: {
    backgroundColor: '#2196F3',
  },
});
