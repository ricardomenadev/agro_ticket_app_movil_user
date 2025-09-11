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
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const AccommodationCard = ({ item, onCall, onEmail }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      
      <Text style={styles.hotelName}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      
      <View style={styles.contactRow}>
        {item.phone && (
          <TouchableOpacity style={styles.contactButton} onPress={() => onCall(item.phone)}>
            <Ionicons name="call" size={16} color="#4CAF50" />
            <Text style={styles.contactText}>{item.phone}</Text>
          </TouchableOpacity>
        )}
        
        {item.email && (
          <TouchableOpacity style={styles.contactButton} onPress={() => onEmail(item.email)}>
            <Ionicons name="mail" size={16} color="#FF9800" />
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const AccommodationScreen = () => {
  const [searchText, setSearchText] = useState('');

  const accommodations = [
    // Charata - 5km
    { id: 1, category: 'Hotel', name: 'HOTEL MOCOVI', address: 'Güemes 1231 (Charata)', phone: '03731 420157', distance: '5km de la muestra' },
    { id: 2, category: 'Hotel', name: 'HOTEL MI DIOS', address: 'Pringles 545 (Charata)', phone: '03731-422382', distance: '5km de la muestra' },
    { id: 3, category: 'Hotel', name: 'HOTEL ALEJANDRO', address: 'Liniers 703 (Charata)', phone: '03731-156 25695', distance: '5km de la muestra' },
    { id: 4, category: 'Hotel', name: 'HOTEL CATANGE', address: 'Ruta 94 - km 71,200 (Charata)', phone: '03731 422090', distance: '5km de la muestra' },
    { id: 5, category: 'Hotel', name: 'HOTEL HNOS. FERRONATO', address: 'Ruta 89 – km 245 (Charata)', phone: '3731 - 623603', distance: '5km de la muestra' },
    { id: 6, category: 'Hospedaje', name: 'HOTEL HOSPEDAJE NORTE', address: 'Lavalle 232', phone: '3731-661576', distance: '5km de la muestra' },
    { id: 7, category: 'Residencial', name: 'RESIDENCIAL MIR-MAR', address: 'Pringles 866 (Charata)', phone: '03731 420354', distance: '5km de la muestra' },
    { id: 8, category: 'Residencial', name: 'RESIDENCIAL MARILÚ', address: 'Perú 273. Charata (Chaco)', phone: '03731-421764', distance: '5km de la muestra' },
    { id: 9, category: 'Apart Hotel', name: 'APART HOTEL MALOCAS', address: 'Liniers 1978 - (Charata)', phone: '03731-156 27356', email: 'malocascharata@gmail.com', distance: '5km de la muestra' },
    { id: 10, category: 'Apart Hotel', name: 'APART JUNIN', address: 'Junín 410, 3730 Charata, Chaco', phone: '03731-620493', distance: '5km de la muestra' },
    
    // Las Breñas - 18km
    { id: 11, category: 'Hotel', name: 'HOTEL IMPERIO', address: 'Avda. de los Inmigrantes y Paraguay. Las Breñas', phone: '03731-460229', distance: '18km de la muestra' },
    { id: 12, category: 'Hotel', name: 'TERRALES HOTEL & APART', address: 'Ruta 89 y Av. Urquiza. Las Breñas', phone: '03731-490005', distance: '18km de la muestra' },
    
    // Corzuela - 40km
    { id: 13, category: 'Hotel', name: 'HOTEL LOS ALAMOS', address: 'Güemes y Uruguay. Corzuela', phone: '03731- 470613', distance: '40km de la muestra' },
    
    // Hermoso Campo - 48km
    { id: 14, category: 'Hotel', name: 'HOTEL METEORITO', address: 'Acceso a Hermoso campo s/n.', phone: '03735-49-5286', email: 'pablotkachuk@hotmail.com', distance: '48km de la muestra' },
    
    // Pampa del Infierno - 70km
    { id: 15, category: 'Hotel', name: 'AYRES DE PAMPA', address: 'Ruta Nac. Nº 16 Km 260. Pampa del infierno', phone: '03644313876', email: 'estudioracca@coyspu.com.ar', distance: '70km de la muestra' },
    
    // Villa Ángela - 88km
    { id: 16, category: 'Hotel', name: 'PETIT HOTEL', address: 'Mitre 531. VILLA ANGELA', phone: '(03735) 421 583', distance: '88km de la muestra' },
    { id: 17, category: 'Hotel', name: 'HOTEL BARILOCHE', address: 'Balcarce 14 esq 25 de mayo. VILLA ANGELA', phone: '(03735) 420 748', distance: '88km de la muestra' },
    { id: 18, category: 'Eco Hotel', name: 'SOL DE CHACO ECOHOTEL', address: 'Balcarce 245. VILLA ANGELA', phone: '03735-420435', distance: '88km de la muestra' },
    
    // Alquileres temporarios
    { id: 19, category: 'Alquiler', name: 'EDIFICIO TOMY', address: 'Monseñor de Carlo 620 – Charata', phone: '3731-492893', distance: '5km de la muestra' },
    { id: 20, category: 'Alquiler', name: 'JUNIN APART', address: 'Junin 410 – Charata', phone: '3731-620493', distance: '5km de la muestra' },
    { id: 21, category: 'Alquiler', name: 'C&C', address: 'Caseros 675 – Charata', phone: '3731-664050', email: 'cintiacanterosa@gmail.com', distance: '5km de la muestra' },
    { id: 22, category: 'Alquiler', name: 'TIDA INMOBILIARIA', address: 'Charata', phone: '03731 – 15651290', distance: '5km de la muestra' },
    { id: 23, category: 'Hotel', name: 'HOTEL PLATINIUM', address: 'Güemes 1563', phone: '03731 15-40-9663', distance: '5km de la muestra' },
  ];

  const filteredAccommodations = accommodations.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.address.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCall = (phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    Linking.openURL(`tel:+54${cleanPhone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hotel': return '#4CAF50';
      case 'Apart Hotel': return '#2196F3';
      case 'Alquiler': return '#FF9800';
      case 'Residencial': return '#9C27B0';
      case 'Hospedaje': return '#607D8B';
      case 'Eco Hotel': return '#8BC34A';
      default: return COLORS.primary;
    }
  };

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
          <Text style={styles.headerTitle}>Alojamiento</Text>
          <Text style={styles.headerSubtitle}>
            Opciones de hospedaje en Charata y región
          </Text>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar alojamiento..."
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

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredAccommodations.length} opciones de alojamiento disponibles
          </Text>
        </View>

        {/* Lista de alojamientos */}
        <View style={styles.listContainer}>
          {filteredAccommodations.map((item) => (
            <AccommodationCard
              key={item.id}
              item={{
                ...item,
                categoryColor: getCategoryColor(item.category)
              }}
              onCall={handleCall}
              onEmail={handleEmail}
            />
          ))}
        </View>

        {filteredAccommodations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="bed-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No se encontraron alojamientos</Text>
            <Text style={styles.emptySubtitle}>
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 40,
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
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  distance: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  hotelName: {
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
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: '500',
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
});

export default AccommodationScreen;