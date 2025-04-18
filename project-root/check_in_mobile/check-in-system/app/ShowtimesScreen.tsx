import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
console.log('ShowtimesScreen mounted');
type Show = {
  id: string;
  beginTime: string;
  endTime: string;
  price: number;
  movie: {
    name: string;
    image?: string;
    length: number;
  };
};

export default function ShowtimesScreen() {
  const [shows, setShows] = useState<Show[]>([]);
  // Inside your component
  const router = useRouter();

  useEffect(() => {
    const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/showtimes`;
    console.log('📦 Fetching showtimes from:', url); //  打印地址
  
    axios.get<Show[]>(url)
      .then((res) => {
        console.log('Received showtimes:', res.data); // 打印结果
        setShows(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch showtimes:', err.message); // 错误信息
      });
  }, []);

  const renderItem = ({ item }: { item: Show }) => {
    const begin = new Date(item.beginTime).toLocaleString();
    const end = new Date(item.endTime).toLocaleString();
    
    return (
      <View style={styles.card}>
        {item.movie.image && (
          <Image source={{ uri: item.movie.image }} style={styles.image} />
        )}
        <View style={styles.info}>
          <Text style={styles.title}>{item.movie.name}</Text>
          <Text style={styles.text}>🕒 {begin} - {end}</Text>
          <Text style={styles.text}>🎟️ ${item.price.toFixed(2)}</Text>
          <Button
              title="View"
              onPress={() => router.push({ pathname: '/showtimes/id', params: { showId: item.id } })}
            />
        </View>
        
      </View>
      
    );
  };

  return (
    <FlatList
      data={shows}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#aaa',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
  },
});
