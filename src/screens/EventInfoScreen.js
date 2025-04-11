import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  ImageBackground, 
} from 'react-native';
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
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.dayHeader}
            >
              <Text style={styles.dayHeaderText}>{day.date}</Text>
            </LinearGradient>
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
              <Ionicons name="location" size={16} color={COLORS.primary} style={styles.addressIcon} />
              <Text style={styles.addressText}>{venueData.address}</Text>
            </View>
            
            <TouchableOpacity style={styles.directionsButton}>
              <Ionicons name="navigate" size={16} color="white" style={styles.directionsIcon} />
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
              <View style={styles.serviceTag}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="wifi" size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.serviceName}>WiFi Gratis</Text>
              </View>
              <View style={styles.serviceTag}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="restaurant" size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.serviceName}>Gastronomía</Text>
              </View>
              <View style={styles.serviceTag}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="car" size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.serviceName}>Estacionamiento</Text>
              </View>
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
      <ImageBackground
    source={require('../../assets/images/agronea-publi1.jpg')}
    style={styles.headerGradient}
    resizeMode="cover"
  >
    <View style={styles.headerOverlay}>
      <Text style={styles.headerTitle}>AGRONEA 2025</Text>
      <Text style={styles.headerSubtitle}>4-6 de Julio • Charata, Chaco</Text>
    </View>
  </ImageBackground>
        
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
    backgroundColor: '#121212', // Fondo oscuro como el Home
  },
  header: {
    backgroundColor: '#1A1A1A', // Un poco más claro que el fondo principal
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
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)', // Overlay negro semitransparente
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#17823B',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
  },
  activeTabText: {
    color: '#FFD700', // Color dorado para el texto activo
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#121212',
  },
  sectionContainer: {
    padding: 16,
  },
  // Estilos para el Schedule
  dayContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dayHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dayHeaderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventsContainer: {
    backgroundColor: '#1A1A1A',
  },
  eventItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontWeight: 'bold',
    color: '#FFD700', // Dorado
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
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  eventContent: {
    flex: 1,
    paddingLeft: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  eventSpeaker: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: 'rgba(23, 130, 59, 0.15)', // Verde semitransparente
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  addButtonText: {
    fontSize: 12,
    color: '#FFD700', // Dorado
    marginRight: 4,
  },
  addButtonIcon: {
    marginTop: 1,
  },
  
  // Estilos para la sección Venue
  mapContainer: {
    backgroundColor: '#1A1A1A',
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
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginBottom: 12,
  },
  venueContent: {
    padding: 16,
  },
  venueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
    color: 'rgba(255,255,255,0.7)',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17823B',
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
    color: 'white',
    marginBottom: 12,
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionItem: {
    marginBottom: 12,
  },
  sectionNameContainer: {
    backgroundColor: '#FFD700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  sectionName: {
    color: '#222222',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)', // Dorado semitransparente
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
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Estilos para la sección FAQ
  faqContainer: {
    backgroundColor: '#1A1A1A',
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 16,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    paddingTop: 8,
  },
});

export default EventInfoScreen;