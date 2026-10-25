// src/utils/deviceId.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'agronea_device_id';

// Devuelve el deviceId persistido, o genera uno nuevo si no existe todavía
export async function getOrCreateDeviceId() {
  try {
    let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = Crypto.randomUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (error) {
    console.error('Error obteniendo deviceId:', error);
    // Fallback: UUID temporal (no persistido) para no romper el flujo
    return Crypto.randomUUID();
  }
}