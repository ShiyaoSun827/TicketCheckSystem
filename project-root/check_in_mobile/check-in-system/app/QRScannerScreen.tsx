import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [qrData, setQrData] = useState<string | null>(null);
  const lockRef = useRef(false); // ✅ 扫描锁
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (lockRef.current) return; // ✅ 已锁住
    lockRef.current = true; // ✅ 加锁

    const code = result?.data ?? '';
    setQrData(code);

    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/checkin`, {
        qrCode: code,
      });

      Alert.alert('✅ Success', res.data.message || 'Ticket checked in!');
    } catch (error) {
      console.error('❌ Check-in failed', error);
      Alert.alert('❌ Error', 'Failed to check in ticket.');
    } finally {
      // ✅ 稍等一会再跳转，避免立即中断摄像头关闭
      setTimeout(() => {
        router.replace({ pathname: '/showtimes/id', params: { showId: id as string } });
      }, 1000);
    }
  };

  if (!permission?.granted) {
    return <Text>Requesting camera permission...</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      {qrData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned: {qrData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 8,
  },
});
