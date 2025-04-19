import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [qrData, setQrData] = useState<string | null>(null);
  const lockRef = useRef(false); // ✅ scan lock
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (lockRef.current) return; // ✅ locked
    lockRef.current = true; // ✅ add lock

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
      // ✅ Please wait for a moment before jumping to the next step. This is to avoid immediately interrupting the camera shut-down process.
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
