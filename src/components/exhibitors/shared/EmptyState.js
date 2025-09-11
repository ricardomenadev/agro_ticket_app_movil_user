// src/components/exhibitors/shared/EmptyState.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Package } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';

const EmptyState = ({ 
  message = "No hay contenido disponible", 
  description = "",
  icon: Icon = Package 
}) => {
  return (
    <View style={styles.container}>
      <Icon size={48} color={COLORS.textSecondary} style={styles.icon} />
      <Text style={styles.message}>{message}</Text>
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;