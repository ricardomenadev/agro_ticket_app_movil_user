import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Search, X, ShoppingCart } from 'lucide-react-native';
import { ProductCard } from '../components/shop';
import { products, productCategories } from '../constants/dummyData';
import { COLORS } from '../constants/colors';

const ShopScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  // Filtrar productos según búsqueda y categoría
  const filteredProducts = products.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Tienda Oficial</Text>
            <View style={styles.cartContainer}>
              <ShoppingCart size={24} color={COLORS.text} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Barra de búsqueda */}
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
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
            style={styles.categoriesContainer}
          >
            {productCategories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id ? styles.activeCategoryButton : styles.inactiveCategoryButton
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category.id ? styles.activeCategoryText : styles.inactiveCategoryText
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Lista de productos */}
        <ScrollView style={styles.productsContainer}>
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
            
            {filteredProducts.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <ShoppingCart size={40} color={COLORS.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateText}>No se encontraron productos</Text>
                <Text style={styles.emptyStateSubtext}>Intenta con otra búsqueda o categoría</Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        {/* Botón de compra rápida */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.floatingButton}>
            <ShoppingCart size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
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
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cartContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  searchBar: {
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
    backgroundColor: 'transparent',
    padding: 0,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  inactiveCategoryButton: {
    backgroundColor: COLORS.border,
  },
  categoryText: {
    fontSize: 14,
  },
  activeCategoryText: {
    color: COLORS.text,
  },
  inactiveCategoryText: {
    color: COLORS.textSecondary,
  },
  productsContainer: {
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyStateContainer: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateIcon: {
    marginBottom: 8,
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: COLORS.border,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
  },
  floatingButton: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ShopScreen;