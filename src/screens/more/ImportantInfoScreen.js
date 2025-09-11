// src/screens/more/ImportantInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const ImportantInfoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información Importante</Text>
        <Text style={styles.headerSubtitle}>
          Todo lo que necesitas saber sobre nuestros eventos
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos AGRONEA 2025</Text>
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>EXPO AGRONEA - CHARATA</Text>
          <Text style={styles.eventDetails}>
            📅 4, 5 y 6 de julio de 2025{'\n'}
            🕐 8:00 a 18:00 horas{'\n'}
            📍 Ruta 89, km 72.5 - Charata, Chaco
          </Text>
        </View>
        
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>EXPO AGRONEA - PAMPA DEL INFIERNO</Text>
          <Text style={styles.eventDetails}>
            📅 12, 13 y 14 de septiembre de 2025{'\n'}
            🕐 16:00 a 23:00 horas{'\n'}
            📍 Ruta 16, km 264 - Pampa del Infierno, Chaco
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acceso a los Eventos</Text>
        <Text style={styles.sectionText}>
          Para ingresar a cualquiera de nuestros eventos, recomendamos adquirir las entradas 
          con anticipación a través de nuestra tienda online en agronea.store. Las entradas 
          digitales deben presentarse mediante el código QR (descargado en PDF o impreso).
        </Text>
        <Text style={styles.sectionText}>
          También se pueden adquirir entradas físicas directamente en el evento, aunque 
          para mayor rapidez en el acceso, recomendamos la compra anticipada online.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estacionamiento</Text>
        <Text style={styles.sectionText}>
          Ambos predios cuentan con estacionamiento disponible. Para acceder, debe contar 
          con su pase de estacionamiento, que puede adquirir junto con su entrada en 
          agronea.store o en las boleterías del evento.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
        <Text style={styles.sectionText}>
          En todos nuestros eventos encontrarás:{'\n\n'}
          • Patio de comidas con variedad gastronómica{'\n'}
          • Sanitarios distribuidos en el predio{'\n'}
          • Servicio de primeros auxilios{'\n'}
          
          • Puntos de información y orientación{'\n'}
          • Estacionamiento para vehículos y motocicletas
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendaciones Generales</Text>
        <Text style={styles.sectionText}>
          • Llegue con tiempo suficiente para evitar demoras en el acceso{'\n'}
          • Mantenga su entrada y pase de estacionamiento en lugar visible{'\n'}
          • Use ropa y calzado cómodo apropiado para actividades al aire libre{'\n'}
          • Consulte la programación de charlas y demostraciones con anticipación{'\n'}
          • Siga las indicaciones del personal de seguridad y organización
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contacto y Consultas</Text>
        <Text style={styles.sectionText}>
          Para consultas sobre entradas, servicios o cualquier información adicional:{'\n\n'}
          📱 WhatsApp: +54 379 4222011{'\n'}
          ✉️ Email: agroneacharata@gmail.com{'\n'}
          🌐 Web: www.expoagronea.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 60,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  eventContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  eventDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    
  },
});

export default ImportantInfoScreen;