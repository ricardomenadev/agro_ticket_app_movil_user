// src/components/home/NewsCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const NewsCard = ({ title, summary, date, image }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <Image 
        source={image ? { uri: image } : { uri: 'https://via.placeholder.com/800x400' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.summary} numberOfLines={2}>{summary}</Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Leer más</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#F3F4F6', // Fondo mientras se carga la imagen
  },
  content: {
    padding: 16,
  },
  date: {
    fontSize: 12,
    color: COLORS.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default NewsCard;