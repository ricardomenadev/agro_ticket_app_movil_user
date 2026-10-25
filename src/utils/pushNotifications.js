// src/utils/pushNotifications.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getOrCreateDeviceId } from './deviceId';

const PUSH_TOKEN_ENDPOINT = __DEV__
  ? 'http://192.168.1.244:5000/api/public/push-token'
  : 'https://api.agronea.store/api/public/push-token';

// Configura cómo se muestran las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Pide permisos, obtiene el token y lo registra en el backend
export async function registerForPushNotifications() {
  // Las notificaciones push no funcionan en simulador/emulador
  if (!Device.isDevice) {
    console.log('Push notifications requieren dispositivo físico');
    return;
  }

  // Verificar permisos actuales
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Si no están concedidos, pedir al usuario
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permisos de notificaciones denegados');
    return;
  }

  // Canal de notificaciones para Android (requerido en Android 8+)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Agronea',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0A8F3C',
    });
  }

  // Obtener el Expo Push Token — projectId requerido en SDK 54
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: '542dc9de-3794-4562-8c40-b287c953b005',
  });
  const token = tokenData.data;

  const deviceId = await getOrCreateDeviceId();

  // Enviar token al backend
  try {
    const response = await fetch(PUSH_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, token }),
    });

    if (!response.ok) {
      console.error('Error registrando push token:', response.status);
    }
  } catch (error) {
    console.error('Error enviando push token al backend:', error);
  }
}