import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { Mail, Map } from 'lucide-react-native';

const DeliveryMethodStep = ({ deliveryMethod, setDeliveryMethod, onNext, onBack }) => {
  const [error, setError] = useState(null);
  
  // Manejar el cambio de método de entrega
  const handleMethodChange = (method) => {
    setDeliveryMethod(method);
    setError(null);
  };
  
  // Validar y continuar
  const handleContinue = () => {
    if (!deliveryMethod) {
      setError('Por favor, selecciona un método de entrega');
      return;
    }
    
    onNext();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Método de Entrega</Text>
      
      {/* Mostrar error si existe */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Opciones de entrega */}
      <View style={styles.optionsContainer}>
        {/* Opción de Email */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            deliveryMethod === 'email' ? styles.selectedOption : {}
          ]}
          onPress={() => handleMethodChange('email')}
        >
          <View style={styles.optionHeader}>
            <View style={[
              styles.radioButton,
              deliveryMethod === 'email' ? styles.radioSelected : {}
            ]}>
              {deliveryMethod === 'email' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Mail 
              size={24} 
              color={deliveryMethod === 'email' ? COLORS.primary : COLORS.textSecondary}
              style={styles.optionIcon}
            />
            <Text style={[
              styles.optionTitle,
              deliveryMethod === 'email' ? styles.selectedText : {}
            ]}>
              Recibir por Email
            </Text>
          </View>
          
          <Text style={styles.optionDescription}>
            Te enviaremos los tickets como archivos PDF adjuntos a tu correo electrónico.
          </Text>
        </TouchableOpacity>
        
        {/* Opción de Oficina */}
        <TouchableOpacity 
          style={[
            styles.optionCard,
            deliveryMethod === 'office' ? styles.selectedOption : {}
          ]}
          onPress={() => handleMethodChange('office')}
        >
          <View style={styles.optionHeader}>
            <View style={[
              styles.radioButton,
              deliveryMethod === 'office' ? styles.radioSelected : {}
            ]}>
              {deliveryMethod === 'office' && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Map 
              size={24} 
              color={deliveryMethod === 'office' ? COLORS.primary : COLORS.textSecondary}
              style={styles.optionIcon}
            />
            <Text style={[
              styles.optionTitle,
              deliveryMethod === 'office' ? styles.selectedText : {}
            ]}>
              Retirar en Oficina
            </Text>
          </View>
          
          <Text style={styles.optionDescription}>
            Retira tus tickets impresos en nuestra oficina central.
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Información adicional para retirar en oficina */}
      {deliveryMethod === 'office' && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Información de la Oficina:</Text>
          <Text style={styles.infoText}>Dirección: Av. Siempre Viva 123, Charata, Chaco</Text>
          <Text style={styles.infoText}>Horarios: Lunes a Viernes de 9:00 a 18:00</Text>
          <Text style={styles.infoText}>Teléfono: (0364) 123-4567</Text>
        </View>
      )}
      
      {/* Botones de navegación */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleContinue}
        >
          <Text style={styles.nextButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ff000020',
    borderWidth: 1,
    borderColor: '#ff0000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff0000',
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 44, // Alinear con el título (radio + icon + margin)
  },
  infoBox: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DeliveryMethodStep;