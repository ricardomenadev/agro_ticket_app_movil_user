// src/screens/more/ImportantInfoScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants/colors';

const ImportantInfoScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información Importante</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horarios del Evento</Text>
        <Text style={styles.sectionText}>
          AGRONEA 2025 estará abierto los días 4, 5 y 6 de julio de 2025, de 8:00 a 18:00 horas.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ubicación</Text>
        <Text style={styles.sectionText}>
          Ruta 94, Km 20, Charata, Chaco.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entrada al Evento</Text>
        <Text style={styles.sectionText}>
          Es necesario presentar su entrada digital mediante el código QR disponible en la sección "Mis Entradas" de esta aplicación.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estacionamiento</Text>
        <Text style={styles.sectionText}>
          El predio cuenta con estacionamiento disponible. Para acceder, debe contar con su pase de estacionamiento, que puede adquirir en la Tienda de la aplicación.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios en el Predio</Text>
        <Text style={styles.sectionText}>
          • Patio de comidas{'\n'}
          • Baños{'\n'}
          • Primeros auxilios{'\n'}
          • Wi-Fi gratuito{'\n'}
          • Punto de información
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    marginBottom: 8,
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
  }
});

export default ImportantInfoScreen;