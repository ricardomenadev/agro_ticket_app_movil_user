import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import { scheduleData, venueData } from '../constants/dummyData';
import { COLORS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const EventInfoScreen = () => {
  const [activeSection, setActiveSection] = useState('schedule');

  const renderSchedule = () => {
    return (
      <View style={styles.sectionContainer}>
        {scheduleData.map((day, index) => (
          <View key={day.date} style={styles.dayContainer}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day.date}</Text>
            </View>
            <View style={styles.eventsContainer}>
              {day.events.map(event => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{event.time}</Text>
                    <View style={styles.timeLineContainer}>
                      <View style={styles.timeLine} />
                    </View>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventLocation}>{event.location}</Text>
                    {event.speaker && (
                      <Text style={styles.eventSpeaker}>Presenta: {event.speaker}</Text>
                    )}
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>Agregar a mi agenda</Text>
                      <Ionicons name="add-circle" size={14} color={COLORS.primary} style={styles.addButtonIcon} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderVenue = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Mapa del predio</Text>
          </View>
          <View style={styles.venueContent}>
            <Text style={styles.venueTitle}>Ubicación</Text>
            <View style={styles.addressContainer}>
              <MapPin size={16} color={COLORS.primary} style={styles.addressIcon} />
              <Text style={styles.addressText}>{venueData.address}</Text>
            </View>
            
            <TouchableOpacity style={styles.directionsButton}>
              <Navigation size={16} color="white" style={styles.directionsIcon} />
              <Text style={styles.directionsText}>Cómo llegar</Text>
            </TouchableOpacity>
            
            <Text style={styles.sectionSubtitle}>Sectores</Text>
            <View style={styles.sectionsContainer}>
              {venueData.sections.map(section => (
                <View key={section.id} style={styles.sectionItem}>
                  <View style={styles.sectionNameContainer}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                  </View>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.sectionSubtitle}>Servicios disponibles</Text>
            <View style={styles.servicesContainer}>
              {venueData.services.map(service => (
                <View key={service.id} style={styles.serviceTag}>
                  <View style={styles.serviceIconContainer}>
                    {service.icon}
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFAQ = () => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.faqContainer}>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Cuál es el horario del evento?</Text>
            <Text style={styles.faqAnswer}>AGRONEA 2025 abre sus puertas de 8:00 a 18:00 durante los tres días del evento (4, 5 y 6 de julio).</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Cómo puedo comprar entradas?</Text>
            <Text style={styles.faqAnswer}>Puedes comprar tus entradas directamente desde la sección Tienda de esta aplicación, o en las boleterías del evento el día de tu visita.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Hay estacionamiento disponible?</Text>
            <Text style={styles.faqAnswer}>Sí, contamos con un amplio estacionamiento para visitantes. Puedes adquirir tu pase de estacionamiento por anticipado en la sección Tienda.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Las charlas y conferencias tienen un costo adicional?</Text>
            <Text style={styles.faqAnswer}>No, todas las charlas, conferencias y demostraciones están incluidas con tu entrada general.</Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>¿Habrá opciones de comida dentro del predio?</Text>
            <Text style={styles.faqAnswer}>Sí, contamos con una variada oferta gastronómica con opciones para todos los gustos y necesidades dietarias.</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'schedule':
        return renderSchedule();
      case 'venue':
        return renderVenue();
      case 'faq':
        return renderFAQ();
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>AGRONEA 2025</Text>
          <Text style={styles.headerSubtitle}>4-6 de Julio • Charata, Chaco</Text>
        </LinearGradient>
        
        {/* Pestañas */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'schedule' && styles.activeTab]}
            onPress={() => setActiveSection('schedule')}
          >
            <Text style={[styles.tabText, activeSection === 'schedule' && styles.activeTabText]}>
              Programa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'venue' && styles.activeTab]}
            onPress={() => setActiveSection('venue')}
          >
            <Text style={[styles.tabText, activeSection === 'venue' && styles.activeTabText]}>
              Ubicación
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeSection === 'faq' && styles.activeTab]}
            onPress={() => setActiveSection('faq')}
          >
            <Text style={[styles.tabText, activeSection === 'faq' && styles.activeTabText]}>
              Preguntas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Contenido principal */}
      <ScrollView>
        {renderContent()}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerGradient: {
    height: 160,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: '#888888',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  sectionContainer: {
    padding: 16,
  },
  // Estilos para el Schedule
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dayHeaderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  eventItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 14,
  },
  timeLineContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  timeLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  eventContent: {
    flex: 1,
    paddingLeft: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 2,
  },
  eventSpeaker: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
  addButtonIcon: {
    marginTop: 1,
  },
  
  // Estilos para la sección Venue
  mapContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    color: '#888888',
    fontSize: 16,
  },
  venueContent: {
    padding: 16,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressIcon: {
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  directionsIcon: {
    marginRight: 8,
  },
  directionsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 12,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionItem: {
    marginBottom: 12,
  },
  sectionNameContainer: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  sectionName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceIconContainer: {
    marginRight: 6,
  },
  serviceName: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Estilos para la sección FAQ
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  faqItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default EventInfoScreen;