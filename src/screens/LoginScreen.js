import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ClipboardList, Mail, Lock, Facebook } from 'lucide-react-native';
import { COLORS, FONTS } from '../styles/theme';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    
    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ClipboardList size={40} color="white" />
        </View>
        <Text style={styles.title}>Mi Agenda AGRONEA</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para crear tu agenda personalizada del evento
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <View style={styles.inputContainer}>
          <Mail size={20} color="#AAAAAA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="usuario@ejemplo.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputContainer}>
          <Lock size={20} color="#AAAAAA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Tu contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes cuenta? </Text>
        <TouchableOpacity>
          <Text style={styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.googleIcon}>
            <Text>G</Text>
          </View>
          <Text style={styles.socialButtonText}>Continuar con Google</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.socialButton}>
          <Facebook size={20} color="#1877F2" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continuar con Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222222',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  registerText: {
    color: '#888888',
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  socialContainer: {
    marginTop: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  googleIcon: {
    marginRight: 8,
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    color: '#444444',
    fontSize: 14,
  },
});

export default LoginScreen;