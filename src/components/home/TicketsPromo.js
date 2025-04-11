import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ticket, CarFront, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../styles/theme';

const TicketsPromo = ({ navigation }) => {
  // Manejadores de navegación a la tienda
  const navigateToTickets = () => {
    // Puedes implementar la navegación a la sección específica de la tienda
    // navigation.navigate('Shop', { filter: 'tickets' });
    console.log('Navegando a compra de entradas');
  };

  const navigateToParking = () => {
    // navigation.navigate('Shop', { filter: 'parking' });
    console.log('Navegando a compra de estacionamiento');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¡Compra tus entradas ya!</Text>
        <Text style={styles.subtitle}>Asegura tu lugar en AGRONEA 2025</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* Tarjeta de Entradas */}
        <TouchableOpacity 
          style={[styles.card, styles.ticketsCard]} 
          activeOpacity={0.8}
          onPress={navigateToTickets}
        >
          <View style={styles.cardIcon}>
            <Ticket size={28} color="white" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Entradas</Text>
            <Text style={styles.cardSubtitle}>Con la misma participas de los sorteos</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Desde $3,500</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <ChevronRight size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* Tarjeta de Estacionamiento */}
        <TouchableOpacity 
          style={[styles.card, styles.parkingCard]} 
          activeOpacity={0.8}
          onPress={navigateToParking}
        >
          <View style={[styles.cardIcon, styles.parkingIcon]}>
            <CarFront size={28} color="white" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Estacionamiento</Text>
            <Text style={styles.cardSubtitle}>Auto, Camioneta</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>Desde $1,800</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <ChevronRight size={20} color={COLORS.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Nota informativa */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Presenta tu entrada digital directamente desde la app para acceder al evento
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardsContainer: {
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  ticketsCard: {
    borderColor: COLORS.primary,
    borderLeftWidth: 4,
  },
  parkingCard: {
    borderColor: COLORS.secondary,
    borderLeftWidth: 4,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  parkingIcon: {
    backgroundColor: COLORS.secondary,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  priceTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#FFF8E1', // Color amarillo claro para resaltar
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#5D534A',
  },
});

export default TicketsPromo;