import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import LoginScreen from './LoginScreen';
import { userEvents } from '../constants/dummyData';
import { COLORS } from '../styles/theme';

const PlannerScreen = ({ isLoggedIn, setIsLoggedIn }) => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Simular carga de eventos
    if (isLoggedIn) {
      setEvents(userEvents);
    }
  }, [isLoggedIn]);
  
  const toggleReminder = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, reminder: !event.reminder }
        : event
    ));
  };
  
  // Renderizar pantalla de login o agenda
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }
  
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Agenda</Text>
        <Text style={styles.headerSubtitle}>
          Organiza tu visita a AGRONEA agregando los eventos que te interesan a tu agenda personalizada.
        </Text>
      </View>
      
      {/* Lista de eventos */}
      <ScrollView style={styles.scrollView}>
        {events.length > 0 ? (
          events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventContent}>
                <View style={styles.iconContainer}>
                  <Calendar size={24} color="white" />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#888888" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{event.time}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <MapPin size={14} color="#888888" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{event.location}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.reminderButton, event.reminder ? styles.activeReminder : styles.inactiveReminder]}
                  onPress={() => toggleReminder(event.id)}
                >
                  <Clock size={18} color={event.reminder ? COLORS.primary : '#888888'} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Calendar size={60} color="#DDDDDD" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>
              Tu agenda está vacía
            </Text>
            <Text style={styles.emptyText}>
              Explora el programa del evento y agrega las actividades que te interesen.
            </Text>
            <TouchableOpacity style={styles.emptyButton}>
              <Text style={styles.emptyButtonText}>Ver Programa</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  scrollView: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },
  eventDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#888888',
  },
  reminderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeReminder: {
    backgroundColor: '#E6F7EB',
  },
  inactiveReminder: {
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PlannerScreen;