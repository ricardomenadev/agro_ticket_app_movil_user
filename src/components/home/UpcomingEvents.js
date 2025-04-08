import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';

// Datos de ejemplo de próximos eventos
const events = [
  {
    id: '1',
    title: 'Conferencia Inaugural',
    date: '4 de Julio',
    time: '10:00 - 12:00',
    location: 'Auditorio Principal',
    highlight: true
  },
  {
    id: '2',
    title: 'Demostración Maquinaria',
    date: '5 de Julio',
    time: '14:30 - 16:30',
    location: 'Campo Experimental',
    highlight: false
  },
  {
    id: '3',
    title: 'Panel Sustentabilidad',
    date: '6 de Julio',
    time: '11:00 - 13:00',
    location: 'Sala Verde',
    highlight: true
  },
  {
    id: '4',
    title: 'Networking Empresarial',
    date: '5 de Julio',
    time: '18:30 - 20:00',
    location: 'Salón VIP',
    highlight: false
  }
];

const EventCard = ({ event, index, scrollX }) => {
  // Calcular la posición para la animación
  const inputRange = [
    (index - 1) * 280,
    index * 280,
    (index + 1) * 280
  ];
  
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp'
  });
  
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp'
  });
  
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [10, 0, 10],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View
      style={[
        styles.eventCard,
        {
          opacity,
          transform: [{ scale }, { translateY }],
          borderColor: event.highlight ? COLORS.primary : COLORS.border
        }
      ]}
    >
      {event.highlight && (
        <View style={styles.highlightBadge}>
          <Text style={styles.highlightText}>Destacado</Text>
        </View>
      )}
      
      <View style={styles.eventHeader}>
        <View style={styles.eventIconContainer}>
          <Calendar size={20} color={COLORS.text} />
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
      </View>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDetailRow}>
          <Calendar size={14} color={COLORS.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{event.date}</Text>
        </View>
        
        <View style={styles.eventDetailRow}>
          <Clock size={14} color={COLORS.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
        
        <View style={styles.eventDetailRow}>
          <MapPin size={14} color={COLORS.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.addToCalendarButton}>
        <Text style={styles.addToCalendarText}>Agregar a mi agenda</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const UpcomingEvents = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  
  useEffect(() => {
    // Auto-scroll horizontal
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        currentIndex = (currentIndex + 1) % events.length;
        scrollViewRef.current.scrollTo({
          x: currentIndex * 280,
          animated: true
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Próximos Eventos</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        snapToInterval={280}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {events.map((event, index) => (
          <EventCard 
            key={event.id} 
            event={event} 
            index={index} 
            scrollX={scrollX} 
          />
        ))}
      </ScrollView>
      
      <View style={styles.paginationContainer}>
        {events.map((_, i) => {
          const width = scrollX.interpolate({
            inputRange: [
              (i - 1) * 280,
              i * 280,
              (i + 1) * 280
            ],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp'
          });
          
          const opacity = scrollX.interpolate({
            inputRange: [
              (i - 1) * 280,
              i * 280,
              (i + 1) * 280
            ],
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp'
          });
          
          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.paginationDot,
                { width, opacity, backgroundColor: COLORS.primary }
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingRight: 16,
  },
  eventCard: {
    width: 260,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderLeftWidth: 4,
    position: 'relative',
  },
  highlightBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  highlightText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  addToCalendarButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addToCalendarText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default UpcomingEvents;