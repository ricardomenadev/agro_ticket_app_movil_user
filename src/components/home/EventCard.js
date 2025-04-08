// src/components/home/EventCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const EventCard = ({ title, time, location, date }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      <View style={styles.dateBar}>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#888888" />
          <Text style={styles.infoText}>{time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#888888" />
          <Text style={styles.infoText}>{location}</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Agregar a mi agenda</Text>
          <Ionicons name="add-circle-outline" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateBar: {
    backgroundColor: COLORS.secondary,
    padding: 8,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default EventCard;