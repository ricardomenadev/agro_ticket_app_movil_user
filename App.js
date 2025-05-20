import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './src/navigation/MainTabNavigator';
import { StoreProvider } from './src/context/StoreContext';

export default function App() {
  return (
    <StoreProvider>
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
      </StoreProvider>
    
  );
}