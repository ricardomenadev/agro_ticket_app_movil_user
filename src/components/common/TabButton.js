// src/components/common/TabButton.js
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const TabButton = ({ iconName, label, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={iconName} 
        size={22} 
        color={isActive ? COLORS.primary : COLORS.textSecondary} 
      />
      <Text 
        style={[
          styles.label, 
          isActive ? styles.activeLabel : styles.inactiveLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  inactiveLabel: {
    color: COLORS.textSecondary,
  }
});

export default TabButton;