import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';
import { EXHIBITORS } from '../../constants/exhibitors2026';
import CategorySelector from './CategorySelector';
import ExhibitorItem from './ExhibitorItem';
import ExhibitorPoster from './ExhibitorPoster';

const ExhibitorsDirectory = () => {
  const [activeCategory, setActiveCategory]       = useState(null);
  const [searchText, setSearchText]               = useState('');
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [posterVisible, setPosterVisible]         = useState(false);

  const filteredExhibitors = useMemo(() => {
    return EXHIBITORS.filter((exp) => {
      const matchesCategory  = activeCategory === null || exp.category === activeCategory;
      const normalizedSearch = searchText.toLowerCase();
      const standStr         = exp.stand ? exp.stand.toLowerCase() : '';
      const matchesSearch =
        searchText.length === 0 ||
        exp.name.toLowerCase().includes(normalizedSearch) ||
        standStr.includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchText]);

  const openPoster  = useCallback((exhibitor) => { setSelectedExhibitor(exhibitor); setPosterVisible(true); }, []);
  const closePoster = useCallback(() => { setPosterVisible(false); setSelectedExhibitor(null); }, []);

  // ListHeader solo tiene el CategorySelector — sin TextInput
  // Así no se recrea cuando el usuario escribe y el input no pierde el foco
  const ListHeader = useCallback(() => (
    <CategorySelector activeCategory={activeCategory} onSelect={setActiveCategory} />
  ), [activeCategory]);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={40} color={COLORS.border} />
      <Text style={styles.emptyText}>No hay expositores para esta búsqueda</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item }) => (
    <ExhibitorItem exhibitor={item} onPress={() => openPoster(item)} />
  ), [openPoster]);

  return (
    <View style={styles.container}>

      {/* TextInput FUERA de la FlatList — nunca se desmonta ni pierde el foco */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar empresa o stand..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredExhibitors}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        initialNumToRender={15}
        windowSize={10}
        keyboardShouldPersistTaps="handled"
      />

      <ExhibitorPoster
        exhibitor={selectedExhibitor}
        visible={posterVisible}
        onClose={closePoster}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ExhibitorsDirectory;