import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Search, X, Filter } from 'lucide-react-native';
import ExhibitorCard from '../components/exhibitors/ExhibitorCard';
import { enhancedExhibitorsList } from '../constants/exhibitorData';
import { COLORS } from '../styles/theme';

// Categorías de expositores
const exhibitorCategories = [
  { id: 'all', name: 'Todos' },
  { id: 'machinery', name: 'Maquinaria' },
  { id: 'seeds', name: 'Semillas' },
  { id: 'tech', name: 'Tecnología' },
  { id: 'services', name: 'Servicios' },
  { id: 'livestock', name: 'Ganadería' }
];

const ExhibitorsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular carga de datos (en producción, esto sería una llamada a la API)
    const fetchExhibitors = () => {
      setLoading(true);
      // Esperar 500ms para simular carga (elimina esto en producción)
      setTimeout(() => {
        setExhibitors(enhancedExhibitorsList);
        setLoading(false);
      }, 500);
    };
    
    fetchExhibitors();
  }, []);
  
  // Filtrar expositores según búsqueda y categoría
  const filteredExhibitors = exhibitors.filter(exhibitor => 
    (activeCategory === 'all' || exhibitor.category === activeCategory) &&
    exhibitor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renderizar categoría
  const renderCategoryButton = (category) => {
    const isActive = activeCategory === category.id;
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          isActive ? styles.activeCategoryButton : styles.inactiveCategoryButton
        ]}
        onPress={() => setActiveCategory(category.id)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            isActive ? styles.activeCategoryText : styles.inactiveCategoryText
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Renderizar mensaje de no resultados
  const renderEmptyResults = () => (
    <View style={styles.emptyContainer}>
      <Search size={40} color={COLORS.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>No se encontraron expositores</Text>
      <Text style={styles.emptySubtext}>Intenta con otra búsqueda o categoría</Text>
    </View>
  );

  // Renderizar cargando
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Cargando expositores...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expositores</Text>
          
          {/* Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar expositor..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filtros por categoría */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScrollView}
            contentContainerStyle={styles.categoriesContent}
          >
            {exhibitorCategories.map(renderCategoryButton)}
          </ScrollView>
        </View>
        
        {/* Lista de expositores */}
        {loading ? (
          renderLoading()
        ) : (
          <ScrollView style={styles.exhibitorsList} contentContainerStyle={styles.exhibitorsListContent}>
            {filteredExhibitors.length > 0 
              ? filteredExhibitors.map(exhibitor => (
                  <ExhibitorCard
                    key={exhibitor.id}
                    exhibitor={exhibitor}
                  />
                ))
              : renderEmptyResults()
            }
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    height: 24,
    padding: 0,
  },
  categoriesScrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  inactiveCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryButtonText: {
    fontSize: 14,
  },
  activeCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  inactiveCategoryText: {
    color: COLORS.textSecondary,
  },
  exhibitorsList: {
    flex: 1,
  },
  exhibitorsListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 12,
  }
});

export default ExhibitorsScreen;