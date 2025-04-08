import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Search, X } from 'lucide-react-native';
import ExhibitorCard from '../components/exhibitors/ExhibitorCard';
import { exhibitors, exhibitorCategories } from '../constants/dummyData';
import { COLORS } from '../constants/colors';

const ExhibitorsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
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
      <Search size={40} color={COLORS.border} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>No se encontraron expositores</Text>
      <Text style={styles.emptySubtext}>Intenta con otra búsqueda o categoría</Text>
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
          >
            {exhibitorCategories.map(renderCategoryButton)}
          </ScrollView>
        </View>
        
        {/* Lista de expositores */}
        <ScrollView style={styles.exhibitorsList}>
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
    shadowOffset: { width: 0, height: 1 },
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
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
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
  },
  categoriesScrollView: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 9999, // rounded-full
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  inactiveCategoryButton: {
    backgroundColor: COLORS.border,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  activeCategoryText: {
    color: COLORS.text,
  },
  inactiveCategoryText: {
    color: COLORS.textSecondary,
  },
  exhibitorsList: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.border,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ExhibitorsScreen;