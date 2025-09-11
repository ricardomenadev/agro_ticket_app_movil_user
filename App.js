import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

// Importar el navegador principal y el provider del store
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { StoreProvider } from './src/context/StoreContext';

export default function App() {
  console.log('🚀 App completo SDK 52 iniciando...');
  
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer>
          {/* ✅ Cambio para edge-to-edge */}
          <StatusBar 
            style="light" 
            backgroundColor="transparent" 
            translucent={true} 
          />
          <MainTabNavigator />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}