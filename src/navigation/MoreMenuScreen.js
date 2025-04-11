import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const MenuItem = ({ title, icon, onPress, color = COLORS.primary }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const MoreMenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image 
            source={require('../assets/images/logos/agronea-logo.jpg')} 
            style={styles.logo} 
          />
          <Text style={styles.welcomeText}>Bienvenido a AGRONEA 2025</Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi AGRONEA</Text>
          <MenuItem 
            title="Mi Agenda" 
            icon="calendar" 
            onPress={() => navigation.navigate('MyAgenda')}
            color="#FFD700"
          />
          <MenuItem 
            title="Mis Entradas" 
            icon="ticket" 
            onPress={() => navigation.navigate('MyTickets')}
            color="#4CAF50"
          />
          <MenuItem 
            title="Mis Productos" 
            icon="bag-check" 
            onPress={() => navigation.navigate('MyProducts')}
            color="#F44336"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <MenuItem 
            title="Guía del Visitante" 
            icon="compass" 
            onPress={() => navigation.navigate('VisitorGuide')}
            color="#2196F3"
          />
          <MenuItem 
            title="Información Importante" 
            icon="information-circle" 
            onPress={() => navigation.navigate('ImportantInfo')}
            color="#FF9800"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <MenuItem 
            title="Términos y Condiciones" 
            icon="document-text" 
            onPress={() => console.log('Términos y Condiciones')}
            color="#9C27B0"
          />
          <MenuItem 
            title="Contacto" 
            icon="mail" 
            onPress={() => console.log('Contacto')}
            color="#00BCD4"
          />
          <MenuItem 
            title="Versión de la App" 
            icon="code-slash" 
            onPress={() => console.log('Versión de la App')}
            color="#607D8B"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default MoreMenuScreen;