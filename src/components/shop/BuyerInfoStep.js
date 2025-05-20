import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { User, Mail, Phone, FileText } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const BuyerInfoStep = ({ buyerInfo, setBuyerInfo, onNext }) => {
  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setBuyerInfo({
      ...buyerInfo,
      [field]: value
    });
    
    // Limpiar error cuando se modifica el campo
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!buyerInfo.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }
    
    if (!buyerInfo.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }
    
    if (!buyerInfo.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^\S+@\S+\.\S+$/.test(buyerInfo.email)) {
      newErrors.email = "El email no es válido";
    }
    
    if (!buyerInfo.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    }
    
    if (!buyerInfo.dni.trim()) {
      newErrors.dni = "El DNI es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    } else {
      Alert.alert(
        "Formulario incompleto",
        "Por favor, completa todos los campos requeridos",
        [{ text: "OK" }]
      );
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Información del Comprador</Text>
      
      {/* Nombre */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre</Text>
        <View style={[styles.inputContainer, errors.firstName && styles.inputError]}>
          <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor={COLORS.textSecondary}
            value={buyerInfo.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
          />
        </View>
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
      </View>
      
      {/* Apellido */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Apellido</Text>
        <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
          <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Tu apellido"
            placeholderTextColor={COLORS.textSecondary}
            value={buyerInfo.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
          />
        </View>
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
      </View>
      
      {/* Email */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputContainer, errors.email && styles.inputError]}>
          <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={COLORS.textSecondary}
            value={buyerInfo.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>
      
      {/* Teléfono */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Teléfono</Text>
        <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
          <Phone size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="+54 9 XXX XXX XXXX"
            placeholderTextColor={COLORS.textSecondary}
            value={buyerInfo.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
        </View>
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone}</Text>
        )}
      </View>
      
      {/* DNI */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>DNI</Text>
        <View style={[styles.inputContainer, errors.dni && styles.inputError]}>
          <FileText size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Tu número de DNI"
            placeholderTextColor={COLORS.textSecondary}
            value={buyerInfo.dni}
            onChangeText={(text) => handleChange('dni', text)}
            keyboardType="number-pad"
          />
        </View>
        {errors.dni && (
          <Text style={styles.errorText}>{errors.dni}</Text>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Continuar</Text>
      </TouchableOpacity>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4d4d',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BuyerInfoStep;