// App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View, ActivityIndicator } from 'react-native';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import { StoreProvider } from './src/context/StoreContext';
import UpdateModal from './src/components/common/UpdateModal';
import { registerForPushNotifications } from './src/utils/pushNotifications';
import AnimatedSplash from './src/components/common/AnimatedSplash';
import { ShopCartProvider } from './src/context/ShopCartContext';

// Links que abren la app: el de "Mis entradas" del mail (agronea.store/mis-entradas/<token>) carga esa compra en Entradas.
// En desarrollo (Expo Go) también entra por exp://.../--/mis-entradas/<token>.
const linking = {
  prefixes: ['agronea://', 'https://agronea.store', 'https://www.agronea.store', ...(__DEV__ ? ['exp://127.0.0.1:8081/--'] : [])],
  config: { screens: { Tickets: { path: 'mis-entradas/:token', alias: ['entradas/:token'] } } },
};

export default function App() {
  const [versionChecked, setVersionChecked] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const [fontsLoaded] = useFonts({
    'Orbitron-Bold': require('./assets/fonts/Orbitron-VariableFont_wght.ttf'),
  });

  // Registrar push notifications al montar la app
  // No bloquea el arranque — corre en segundo plano
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#0A8F3C" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <ShopCartProvider>
          <NavigationContainer linking={linking}>
            <StatusBar style="light" backgroundColor="transparent" translucent={true} />
            <MainTabNavigator versionChecked={versionChecked} />
          </NavigationContainer>
        </ShopCartProvider>
        <UpdateModal onDismiss={() => setVersionChecked(true)} />
        {!splashDone && <AnimatedSplash onDone={() => setSplashDone(true)} />}
      </StoreProvider>
    </SafeAreaProvider>
  );
}