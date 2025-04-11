import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExhibitorsScreen from '../screens/ExhibitorsScreen';
import ExhibitorProfileScreen from '../components/exhibitors/ExhibitorProfileScreen';
import { COLORS } from '../styles/theme';

const Stack = createStackNavigator();

const ExhibitorsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background }
      }}
    >
      <Stack.Screen 
        name="ExhibitorsList" 
        component={ExhibitorsScreen} 
      />
      <Stack.Screen 
        name="ExhibitorProfile" 
        component={ExhibitorProfileScreen}
        options={{ 
          presentation: 'modal',
          cardOverlayEnabled: true,
          gestureEnabled: true,
          animationEnabled: true
        }} 
      />
    </Stack.Navigator>
  );
};

export default ExhibitorsStackNavigator;