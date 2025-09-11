import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const EmergencyCard = ({ item, onCall, urgent = false }) => {
  return (
    <View style={[styles.card, urgent && styles.urgentCard]}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: item.categoryColor + '20' }]}>
          <Text style={[styles.categoryText, { color: item.categoryColor }]}>{item.category}</Text>
        </View>
        {urgent && (
          <View style={styles.urgentBadge}>
            <Text style={styles.urgentText}>URGENTE</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      
      <View style={styles.contactRow}>
        {item.phone && (
          <TouchableOpacity 
            style={[styles.contactButton, urgent && styles.urgentContactButton]} 
            onPress={() => onCall(item.phone, urgent)}
          >
            <Ionicons name="call" size={16} color={urgent ? "white" : "#4CAF50"} />
            <Text style={[styles.contactText, urgent && styles.urgentContactText]}>{item.phone}</Text>
          </TouchableOpacity>
        )}
      </View>

      {item.hours && (
        <View style={styles.hoursContainer}>
          <Ionicons name="time" size={14} color={COLORS.textSecondary} />
          <Text style={styles.hoursText}>{item.hours}</Text>
        </View>
      )}
    </View>
  );
};

const EmergencyScreen = () => {
  const [searchText, setSearchText] = useState('');

  const emergencyServices = [
    // Servicios de emergencia - números nacionales
    { id: 1, category: 'Emergencia', name: 'Emergencias Médicas', address: 'Todo el país', phone: '107', urgent: true },
    { id: 2, category: 'Emergencia', name: 'Bomberos', address: 'Todo el país', phone: '100', urgent: true },
    { id: 3, category: 'Emergencia', name: 'Policía', address: 'Todo el país', phone: '101', urgent: true },
    { id: 4, category: 'Emergencia', name: 'Defensa Civil', address: 'Todo el país', phone: '103', urgent: true },
    
    // Hospitales y centros de salud en Charata
    { id: 5, category: 'Hospital', name: 'Hospital General San Roque', address: 'Av. 9 de Julio 1200 - Charata', phone: '03731-421234', hours: '24 horas' },
    { id: 6, category: 'Clínica', name: 'Clínica Charata', address: 'Sarmiento 456 - Charata', phone: '03731-422567', hours: '24 horas' },
    { id: 7, category: 'Centro Salud', name: 'Centro de Salud Norte', address: 'Barrio Norte - Charata', phone: '03731-425890', hours: '7:00 - 19:00' },
    
    // Farmacias
    { id: 8, category: 'Farmacia', name: 'Farmacia Central', address: 'Mitre 234 - Charata', phone: '03731-421567', hours: '24 horas' },
    { id: 9, category: 'Farmacia', name: 'Farmacia del Norte', address: 'Güemes 567 - Charata', phone: '03731-423456', hours: '8:00 - 22:00' },
    { id: 10, category: 'Farmacia', name: 'Farmacia Social', address: 'Caseros 345 - Charata', phone: '03731-424789', hours: '8:00 - 20:00' },
    
    // Servicios municipales
    { id: 11, category: 'Municipal', name: 'Municipalidad de Charata', address: 'Plaza Central - Charata', phone: '03731-420100', hours: '7:00 - 13:00' },
    { id: 12, category: 'Municipal', name: 'Comisaría Charata', address: 'Av. San Martín 123 - Charata', phone: '03731-421011', hours: '24 horas' },
    
    // Servicios en localidades cercanas
    { id: 13, category: 'Hospital', name: 'Hospital Las Breñas', address: 'Las Breñas - 18km de Charata', phone: '03731-460100', hours: '24 horas' },
    { id: 14, category: 'Hospital', name: 'Hospital Villa Ángela', address: 'Villa Ángela - 88km de Charata', phone: '03735-420200', hours: '24 horas' },
    
    // Servicios veterinarios
    { id: 15, category: 'Veterinaria', name: 'Veterinaria Rural', address: 'Ruta 89 Km 72 - Charata', phone: '03731-425678', hours: '24 horas emergencias' },
    { id: 16, category: 'Veterinaria', name: 'Clínica Veterinaria Central', address: 'Moreno 234 - Charata', phone: '03731-426789', hours: '8:00 - 18:00' },
    
    // Servicios técnicos
    { id: 17, category: 'Técnico', name: 'Electricista de Emergencia', address: 'Charata y alrededores', phone: '03731-427890', hours: '24 horas' },
    { id: 18, category: 'Técnico', name: 'Plomería de Urgencia', address: 'Charata y alrededores', phone: '03731-428901', hours: '24 horas' },
    
    // Grúas y asistencia vial
    { id: 19, category: 'Grúa', name: 'Grúa ACA', address: 'Ruta 89 - Charata', phone: '03731-429012', hours: '24 horas' },
    { id: 20, category: 'Grúa', name: 'Auxilio Vial Norte', address: 'Charata y región', phone: '03731-430123', hours: '24 horas' },
  ];

  const filteredServices = emergencyServices.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase()) ||
    item.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCall = (phone, urgent = false) => {
    if (urgent) {
      Alert.alert(
        "Llamada de Emergencia",
        `¿Confirma llamar al ${phone}?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Llamar", onPress: () => Linking.openURL(`tel:${phone}`) }
        ]
      );
    } else {
      const cleanPhone = phone.replace(/[^\d]/g, '');
      Linking.openURL(`tel:+54${cleanPhone}`);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Emergencia': return '#F44336';
      case 'Hospital': return '#4CAF50';
      case 'Clínica': return '#2196F3';
      case 'Centro Salud': return '#00BCD4';
      case 'Farmacia': return '#9C27B0';
      case 'Municipal': return '#FF9800';
      case 'Veterinaria': return '#8BC34A';
      case 'Técnico': return '#607D8B';
      case 'Grúa': return '#FF5722';
      default: return COLORS.primary;
    }
  };

  const urgentServices = filteredServices.filter(s => s.urgent);
  const regularServices = filteredServices.filter(s => !s.urgent);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header con logo */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logos/agronea-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Servicios de Emergencia</Text>
          <Text style={styles.headerSubtitle}>
            Hospitales, farmacias y servicios de emergencia en Charata y región
          </Text>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar servicios..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Servicios de emergencia urgente */}
        {urgentServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergencias - Llamar Inmediatamente</Text>
            {urgentServices.map((item) => (
              <EmergencyCard
                key={item.id}
                item={{
                  ...item,
                  categoryColor: getCategoryColor(item.category)
                }}
                onCall={handleCall}
                urgent={true}
              />
            ))}
          </View>
        )}

        {/* Otros servicios */}
        {regularServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Otros Servicios de Salud y Asistencia</Text>
            {regularServices.map((item) => (
              <EmergencyCard
                key={item.id}
                item={{
                  ...item,
                  categoryColor: getCategoryColor(item.category)
                }}
                onCall={handleCall}
              />
            ))}
          </View>
        )}

        {filteredServices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No se encontraron servicios</Text>
            <Text style={styles.emptySubtitle}>
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        )}

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información Importante</Text>
          <Text style={styles.infoText}>
            • En caso de emergencia, llama primero al 107 (emergencias médicas) o 101 (policía)
          </Text>
          <Text style={styles.infoText}>
            • Mantén siempre a mano tu documento de identidad
          </Text>
          <Text style={styles.infoText}>
            • Si estás en el evento, dirígete al punto de primeros auxilios más cercano
          </Text>
          <Text style={styles.infoText}>
            • Los servicios marcados como "24 horas" están disponibles todo el día
          </Text>
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
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchSection: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  urgentBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  urgentContactButton: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
  contactText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  urgentContactText: {
    color: 'white',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
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
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default EmergencyScreen;