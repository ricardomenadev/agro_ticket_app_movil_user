import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExhibitorsScreen from '../screens/ExhibitorsScreen';
// Ajusta la ruta según donde tengas el componente
import ExhibitorProfileScreen from '../components/exhibitors/ExhibitorProfileScreen';
import { COLORS } from '../styles/theme';

const Stack = createStackNavigator();

const ExhibitorsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="ExhibitorsList"
        component={ExhibitorsScreen}
        options={{
          title: 'Expositores',
        }}
      />
      <Stack.Screen
        name="ExhibitorProfile"
        component={ExhibitorProfileScreen}
        options={{
          presentation: 'modal',
          cardOverlayEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'vertical',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ExhibitorsStackNavigator;