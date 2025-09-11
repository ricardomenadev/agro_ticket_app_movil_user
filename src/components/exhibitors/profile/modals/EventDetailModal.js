// src/components/exhibitors/profile/modals/EventDetailModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Clock, MapPin, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const EventDetailModal = ({ visible, event, onClose }) => {
  if (!event) return null;

  // Formatear fecha completa
  const formatFullDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  // Formatear hora
  const formatTime = (timeString) => {
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, '#B8860B']}
          style={styles.modalHeader}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>Detalles del Evento</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView 
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Event Title */}
          <View style={styles.section}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>

          {/* Event Details */}
          <View style={styles.section}>
            <View style={styles.detailsContainer}>
              {/* Date */}
              <View style={styles.detailRow}>
                <View style={styles.iconContainer}>
                  <Calendar size={20} color={COLORS.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>
                    {formatFullDate(event.date)}
                  </Text>
                </View>
              </View>

              {/* Time */}
              {event.time && (
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <Clock size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Horario</Text>
                    <Text style={styles.detailValue}>
                      {formatTime(event.time)} hs
                    </Text>
                  </View>
                </View>
              )}

              {/* Location */}
              {event.location && (
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <MapPin size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Ubicación</Text>
                    <Text style={styles.detailValue}>
                      {event.location}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  {event.description}
                </Text>
              </View>
            </View>
          )}

          
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  eventTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.secondary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  descriptionContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetailModal;