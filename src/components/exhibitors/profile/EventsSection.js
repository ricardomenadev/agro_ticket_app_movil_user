// src/components/exhibitors/profile/EventsSection.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../constants/colors';
import EmptyState from '../shared/EmptyState';
import EventDetailModal from './modals/EventDetailModal';

const EventsSection = ({ events = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (events.length === 0) {
    return (
      <EmptyState 
        message="No hay eventos programados"
        description="Este expositor aún no ha programado actividades"
      />
    );
  }

  // Función para formatear fecha
  const formatEventDate = (dateString) => {
    if (!dateString) return { day: '?', month: '?' };
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
      
      return { day, month };
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return { day: '?', month: '?' };
    }
  };

  // Función para formatear hora
  const formatEventTime = (timeString) => {
    if (!timeString) return null;
    
    try {
      if (timeString.includes(':')) {
        const parts = timeString.split(':');
        return `${parts[0]}:${parts[1]}`;
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  // Manejar clic en evento
  const handleEventPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Agenda de Actividades</Text>
      <View style={styles.eventsContainer}>
        {events.map(event => {
          const { day, month } = formatEventDate(event.date);
          const formattedTime = formatEventTime(event.time);
          
          return (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard} 
              activeOpacity={0.9}
              onPress={() => handleEventPress(event)}
            >
              <LinearGradient
                colors={[COLORS.card, '#2A2A2A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.eventCardGradient}
              >
                <View style={styles.eventDateContainer}>
                  <Text style={styles.eventDay}>{day}</Text>
                  <Text style={styles.eventMonth}>{month}</Text>
                </View>
                
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  
                  {formattedTime && (
                    <View style={styles.eventDetailsRow}>
                      <Clock size={14} color={COLORS.secondary} style={styles.eventIcon} />
                      <Text style={styles.eventDetailText}>{formattedTime}</Text>
                    </View>
                  )}
                  
                  {event.location && (
                    <View style={styles.eventDetailsRow}>
                      <MapPin size={14} color={COLORS.secondary} style={styles.eventIcon} />
                      <Text style={styles.eventDetailText} numberOfLines={1}>
                        {event.location}
                      </Text>
                    </View>
                  )}
                  
                  {event.description && (
                    <Text style={styles.eventDescription} numberOfLines={2}>
                      {event.description}
                    </Text>
                  )}
                </View>
                
                <View style={styles.eventActions}>
                  <TouchableOpacity 
                    style={styles.viewMoreButton}
                    onPress={() => handleEventPress(event)}
                  >
                    <Text style={styles.viewMoreButtonText}>Ver más</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal de detalles */}
      <EventDetailModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventsContainer: {
    marginBottom: 16,
  },
  eventCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  eventDateContainer: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDay: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  eventTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventIcon: {
    marginRight: 6,
  },
  eventDetailText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    flex: 1,
  },
  eventDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  eventActions: {
    justifyContent: 'center',
  },
  viewMoreButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  viewMoreButtonText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default EventsSection;