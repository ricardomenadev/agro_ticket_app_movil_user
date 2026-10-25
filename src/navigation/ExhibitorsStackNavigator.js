import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExhibitorsScreen from '../screens/ExhibitorsScreen';
import { COLORS } from '../styles/theme';

const Stack = createStackNavigator();

const ExhibitorsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="ExhibitorsList"
        component={ExhibitorsScreen}
      />
    </Stack.Navigator>
  );
};

export default ExhibitorsStackNavigator;