import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView
} from 'react-native';
import { Check, ArrowRight, Ticket, ShoppingBag } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

const PaymentConfirmationScreen = ({ navigation, route }) => {
  // Navegar a mis tickets
  const goToMyTickets = () => {
    navigation.navigate('MyTicketsScreen');
  };
  
  // Navegar a inicio
  const goToHome = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* GIF de celebración */}
        <View style={styles.gifContainer}>
          <Image 
            source={{ uri: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3hlYWpraXZjdjc2aDJzdGYyd2F2YTFoeGw0eGJqbHRuM291ajJwYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4exk4zsAqPcq08/giphy.gif' }} 
            style={styles.celebrationGif}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.successIconContainer}>
          <Check size={80} color={COLORS.primary} />
        </View>
        
        <Text style={styles.title}>¡Compra Exitosa!</Text>
        
        <Text style={styles.message}>
          Tu pago ha sido procesado correctamente. Podrás ver tus tickets y productos adquiridos en la sección "Mis Tickets".
        </Text>
        
        <View style={styles.ticketImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/400x200/336699/FFFFFF?text=Tickets+AGRONEA' }}
            style={styles.ticketImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Datos importantes:</Text>
          <Text style={styles.infoText}>• Los tickets son válidos únicamente para la fecha indicada</Text>
          <Text style={styles.infoText}>• Presenta el código QR en la entrada del evento</Text>
          <Text style={styles.infoText}>• Los productos físicos se retiran en el stand oficial del evento</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={goToMyTickets}
          >
            <Ticket size={20} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Ver Mis Tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={goToMyTickets}
          >
            <ShoppingBag size={20} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Ver Mis Productos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tertiaryButton}
            onPress={goToHome}
          >
            <Text style={styles.tertiaryButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  gifContainer: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationGif: {
    width: '100%',
    height: '100%',
  },
  successIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  ticketImageContainer: {
    width: '100%',
    height: 150,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary || '#4a90e2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  tertiaryButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.border,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tertiaryButtonText: {
    color: COLORS.text,
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  }
});

export default PaymentConfirmationScreen;