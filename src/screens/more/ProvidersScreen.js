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

const ProviderCard = ({ item, onCall, onEmail }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: item.categoryColor + '20' }]}>
          <Text style={[styles.categoryText, { color: item.categoryColor }]}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.companyName}>{item.name}</Text>
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

        {item.facebook && (
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(item.facebook)}>
            <Ionicons name="logo-facebook" size={16} color="#1877F2" />
            <Text style={styles.contactText}>Facebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const ProvidersScreen = () => {
  const [searchText, setSearchText] = useState('');

  const providers = [
    // Alquiler carpas
    { id: 1, category: 'Alquiler Carpas', name: 'ALQUILERES IBERÁ', address: 'Ruta 16 - km 177 - La Madrid Pcia. R. Saenz Peña', phone: '03644 - 351531', email: 'alquileresibera@gmail.com' },
    { id: 2, category: 'Alquiler Carpas', name: 'CARPAS JOSELITO', address: 'Luciano Leiva 1641 - Margarita - Sta. Fe', phone: '03483-498523', email: 'servicios_joselito@yahoo.com.ar' },
    { id: 3, category: 'Alquiler Carpas', name: 'SERVICIOS JULIANA', address: 'De Claudio Sterzer', phone: '03735-154 53963', email: 'serviciosjuliana@yahoo.com' },
    
    // Alquiler bidones y agua
    { id: 4, category: 'Agua y Dispensers', name: 'AGUAS ADA', address: 'Charata - Chaco', phone: '03731-430445' },
    
    // Alquiler de mástiles y plantas
    { id: 5, category: 'Alquiler Mástiles', name: 'Eladio Juárez', address: 'No especificada', phone: '3564 571539' },
    { id: 6, category: 'Alquiler Plantas', name: 'Doña Irene', address: 'No especificada', phone: '3731 - 621769' },
    
    // Mobiliarios y ambientación
    { id: 7, category: 'Mobiliarios', name: 'SERVICIOS JULIANA', address: 'De Claudio Sterzer', phone: '03735-15453963', email: 'serviciosjuliana@yahoo.com' },
    { id: 8, category: 'Mobiliarios', name: 'AMBIENTACIONES', address: 'Natalia Truscello', phone: '3731553398' },
    { id: 9, category: 'Mobiliarios', name: 'INTERMEDIOS DISEÑOS Y CARTELERIA', address: 'No especificada', phone: '3731-629096', email: 'intermediosdg@gmail.com' },
    
    // Armado de stands
    { id: 10, category: 'Armado Stands', name: 'SERCONS', address: 'Diseño y armado de stand', phone: '54-0362-449-9148', email: 'servicioscons2011@gmail.com' },
    { id: 11, category: 'Armado Stands', name: 'MARKETING', address: 'Fabián Moncada', phone: '3624-371827' },
    { id: 12, category: 'Armado Stands', name: 'INTERMEDIOS', address: 'No especificada', phone: '3731-629096' },
    
    // Diseño y ambientación
    { id: 13, category: 'Diseño', name: 'ESTUDIO CRETA', address: 'No especificada', phone: '3731-400719', email: 'mariasolsalgueira@hotmail.com' },
    
    // Fotografía y filmaciones
    { id: 14, category: 'Audiovisual', name: 'VIDEOGRAFO Diego Damian Bendersky', address: 'No especificada', phone: '3731-540511' },
    { id: 15, category: 'Audiovisual', name: 'SKY PRODUCCIONES', address: 'No especificada', phone: '364-44630977' },
    
    // Promotoras
    { id: 16, category: 'Promotoras', name: 'ESTHER RAMIREZ', address: 'No especificada', phone: '3731-405224', email: 'esty_ramirez@hotmail.com.ar' },
    
    // Seguridad
    { id: 17, category: 'Seguridad', name: 'Policía del Chaco', address: 'Charata - Chaco', phone: 'Consultar' },
    { id: 18, category: 'Seguridad', name: 'SEGURIDAD PRIVADA', address: 'Carlos Díaz - Charata - Chaco', phone: '3731-512964' },
    
    // Sonido e iluminación
    { id: 19, category: 'Sonido', name: 'FG SONIDO ILUMINACION PANTALLA', address: 'Francis Dj', phone: '3731-536252', email: 'francimis2011@hotmail.com', facebook: 'https://facebook.com/Fg-sonido-e-iluminación' },
    { id: 20, category: 'Sonido', name: 'SKY PRODUCCIONES', address: 'Alquiler de pantallas y tv led', phone: '36444630977' },
    { id: 21, category: 'Sonido', name: 'SERVICIOS JULIANA', address: 'De Claudio Sterzer', phone: '03735-15453963', email: 'serviciosjuliana@yahoo.com' },
  ];

  const filteredProviders = providers.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase()) ||
    item.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCall = (phone) => {
    if (phone === 'Consultar' || phone === 'consultar') return;
    const cleanPhone = phone.replace(/[^\d]/g, '');
    Linking.openURL(`tel:+54${cleanPhone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Alquiler Carpas': return '#4CAF50';
      case 'Agua y Dispensers': return '#2196F3';
      case 'Alquiler Mástiles': return '#FF9800';
      case 'Alquiler Plantas': return '#8BC34A';
      case 'Mobiliarios': return '#9C27B0';
      case 'Armado Stands': return '#F44336';
      case 'Diseño': return '#E91E63';
      case 'Audiovisual': return '#FF5722';
      case 'Promotoras': return '#FFC107';
      case 'Seguridad': return '#607D8B';
      case 'Sonido': return '#3F51B5';
      default: return COLORS.primary;
    }
  };

  const categories = [...new Set(providers.map(p => p.category))].sort();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header con logo */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logoAgronea2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Proveedores Sugeridos</Text>
          <Text style={styles.headerSubtitle}>
            Empresas proveedoras que pueden ser de utilidad para la muestra
          </Text>
        </View>

        {/* Búsqueda */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar proveedores..."
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

        {/* Categorías disponibles */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Rubros disponibles:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category, index) => (
              <View key={index} style={[styles.categoryChip, { borderColor: getCategoryColor(category) }]}>
                <Text style={[styles.categoryChipText, { color: getCategoryColor(category) }]}>
                  {category}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {filteredProviders.length} proveedores disponibles en {categories.length} rubros
          </Text>
        </View>

        {/* Lista de proveedores */}
        <View style={styles.listContainer}>
          {filteredProviders.map((item) => (
            <ProviderCard
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

        {filteredProviders.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No se encontraron proveedores</Text>
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
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  companyName: {
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

export default ProvidersScreen;