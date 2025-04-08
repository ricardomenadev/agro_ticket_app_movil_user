// src/components/home/ExhibitorPreview.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../styles/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 = padding horizontal (16) * 2 + gap (16)

const ExhibitorPreview = ({ name, category, logo }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Image 
        source={logo ? { uri: logo } : { uri: 'https://via.placeholder.com/150' }} 
        style={styles.logo} 
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.category}>{category}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    backgroundColor: '#F3F4F6', // Añadido para tener un fondo mientras carga
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222222',
    textAlign: 'center',
  },
  category: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
});

export default ExhibitorPreview;