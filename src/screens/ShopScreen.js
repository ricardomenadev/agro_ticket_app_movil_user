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
  Image,
  Modal,
  FlatList,
  Animated
} from 'react-native';
import { Search, X, ShoppingCart, Trash2, Check, ArrowRight } from 'lucide-react-native';
import { COLORS } from '../constants/colors';

// Datos estáticos para simular la API
const productCategories = [
  { id: 'all', name: 'Todos' },
  { id: 'clothing', name: 'Indumentaria' },
  { id: 'accessories', name: 'Accesorios' },
  { id: 'tickets', name: 'Entradas' },
  { id: 'gadgets', name: 'Gadgets' },
  { id: 'souvenirs', name: 'Recuerdos' },
];

// Productos con imágenes (simulados)
const products = [
  {
    id: '1',
    name: 'Entrada General',
    description: 'Acceso completo a todas las actividades y exposiciones',
    price: 3500,
    category: 'tickets',
    image: 'https://via.placeholder.com/300x200/87CEEB/000000?text=Entrada+General',
    featured: true,
    stock: 200
  },
  {
    id: '2',
    name: 'Estacionamiento',
    description: 'Acceso al estacionamiento general del evento',
    price: 6500,
    category: 'tickets',
    image: 'https://via.placeholder.com/300x200/FFD700/000000?text=Entrada+VIP',
    featured: true,
    stock: 50
  },
  {
    id: '3',
    name: 'Gorra AGRONEA',
    description: 'Gorra oficial del evento en color negro',
    price: 2800,
    category: 'clothing',
    image: 'https://via.placeholder.com/300x200/2E8B57/FFFFFF?text=Gorra+AGRONEA',
    featured: false,
    stock: 75
  },
  {
    id: '4',
    name: 'Remera Oficial',
    description: 'Remera conmemorativa del evento',
    price: 3200,
    category: 'clothing',
    image: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Remera+Oficial',
    featured: false,
    stock: 100
  },
  {
    id: '5',
    name: 'Kit Mate AGRONEA',
    description: 'Set completo de mate con logo del evento',
    price: 5900,
    category: 'accessories',
    image: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Kit+Mate',
    featured: true,
    stock: 30
  },
  {
    id: '6',
    name: 'Botella Térmica',
    description: 'Mantiene bebidas frías o calientes por 24hs',
    price: 4200,
    category: 'accessories',
    image: 'https://via.placeholder.com/300x200/CD5C5C/FFFFFF?text=Botella+Térmica',
    featured: false,
    stock: 60
  },
  {
    id: '7',
    name: 'Mochila AGRONEA',
    description: 'Mochila resistente con múltiples compartimentos',
    price: 8900,
    category: 'accessories',
    image: 'https://via.placeholder.com/300x200/4682B4/FFFFFF?text=Mochila',
    featured: true,
    stock: 40
  },
  {
    id: '8',
    name: 'Llavero Conmemorativo',
    description: 'Llavero metálico edición especial del evento',
    price: 1500,
    category: 'souvenirs',
    image: 'https://via.placeholder.com/300x200/BDB76B/000000?text=Llavero',
    featured: false,
    stock: 120
  },
];

// Componente mejorado de tarjeta de producto con animación
const EnhancedProductCard = ({ product, onAddToCart, featured = false }) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1]
  });

  return (
    <Animated.View 
      style={[
        featured ? styles.featuredProductCard : styles.productCard, 
        { opacity, transform: [{ translateY }] }
      ]}
    >
      {featured && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Destacado</Text>
          </View>
        </View>
      )}
      
      <Image 
        source={{ uri: product.image }} 
        style={featured ? styles.featuredProductImage : styles.productImage} 
        resizeMode="cover"
      />
      
      <View style={styles.productContent}>
        <Text style={featured ? styles.featuredProductName : styles.productName}>
          {product.name}
        </Text>
        
        <Text style={styles.productDescription}>
          {product.description}
        </Text>
        
        <View style={styles.stockContainer}>
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockFill, 
                { 
                  width: `${Math.min(100, (product.stock / 200) * 100)}%`,
                  backgroundColor: product.stock < 10 ? '#ff4d4d' : product.stock < 30 ? '#ffbb33' : COLORS.primary 
                }
              ]} 
            />
          </View>
          <Text style={styles.stockText}>{product.stock} disponibles</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={featured ? styles.featuredPrice : styles.price}>
            ${product.price.toLocaleString()}
          </Text>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => onAddToCart(product)}
          >
            <ShoppingCart size={featured ? 20 : 18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Componente para el item del carrito
const CartItem = ({ item, onRemove }) => (
  <View style={styles.cartItem}>
    <Image source={{ uri: item.image }} style={styles.cartItemImage} />
    
    <View style={styles.cartItemContent}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemPrice}>${item.price.toLocaleString()}</Text>
    </View>
    
    <TouchableOpacity 
      style={styles.removeButton}
      onPress={onRemove}
    >
      <Trash2 size={18} color="#ff4d4d" />
    </TouchableOpacity>
  </View>
);

// Componente principal de la pantalla de tienda
const ShopScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  
  // Calcular total del carrito
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  
  // Filtrar productos según búsqueda y categoría
  const filteredProducts = products.filter(product => 
    (activeCategory === 'all' || product.category === activeCategory) &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Obtener productos destacados
  const featuredProducts = products.filter(product => product.featured);
  
  // Función para agregar al carrito
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };
  
  // Función para remover del carrito
  const removeFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };
  
  // Función para ir al proceso de pago
  const goToCheckout = () => {
    setCartModalVisible(false);
    setCheckoutModalVisible(true);
  };
  
  // Función para procesar el pago
  const processPayment = () => {
    setCheckoutModalVisible(false);
    setConfirmationVisible(true);
    // Vaciar carrito después del pago exitoso
    setCartItems([]);
  };
  
  // Función para finalizar
  const finishPurchase = () => {
    setConfirmationVisible(false);
    // Aquí podrías navegar a la sección de "Mis Tickets"
    // navigation.navigate('MyTickets');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <ScrollView style={styles.container}>
        {/* Banner del evento */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/1000x400/336699/FFFFFF?text=AGRONEA+2025' }} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerMainText}>AGRONEA 2025</Text>
            <Text style={styles.bannerSubText}>Adquiere tus entradas y productos oficiales</Text>
          </View>
        </View>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Tienda Oficial</Text>
            <TouchableOpacity 
              style={styles.cartContainer}
              onPress={() => setCartModalVisible(true)}
            >
              <ShoppingCart size={24} color={COLORS.text} />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
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
        
        {/* Sección de productos destacados */}
        {activeCategory === 'all' && featuredProducts.length > 0 && (
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            {featuredProducts.map(product => (
              <EnhancedProductCard 
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                featured={true}
              />
            ))}
          </View>
        )}
        
        {/* Lista de productos */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {activeCategory === 'all' ? 'Todos los Productos' : productCategories.find(c => c.id === activeCategory)?.name || 'Productos'}
          </Text>
          
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => {
              // No mostrar productos destacados cuando estamos en categoría 'all' para evitar duplicados
              if (activeCategory === 'all' && product.featured) return null;
              
              return (
                <EnhancedProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  featured={false}
                />
              );
            })}
            
            {filteredProducts.length === 0 && (
              <View style={styles.emptyStateContainer}>
                <ShoppingCart size={40} color={COLORS.border} style={styles.emptyStateIcon} />
                <Text style={styles.emptyStateText}>No se encontraron productos</Text>
                <Text style={styles.emptyStateSubtext}>Intenta con otra búsqueda o categoría</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Botón flotante de carrito */}
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setCartModalVisible(true)}
        >
          <ShoppingCart size={24} color={COLORS.text} />
          <Text style={styles.floatingButtonText}>{cartItems.length}</Text>
        </TouchableOpacity>
      )}
      
      {/* Modal del Carrito */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tu Carrito</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            {cartItems.length > 0 ? (
              <>
                <FlatList
                  data={cartItems}
                  renderItem={({ item, index }) => (
                    <CartItem 
                      item={item} 
                      onRemove={() => removeFromCart(index)} 
                    />
                  )}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  style={styles.cartList}
                />
                
                <View style={styles.cartSummary}>
                  <Text style={styles.cartTotal}>Total: ${cartTotal.toLocaleString()}</Text>
                  <TouchableOpacity 
                    style={styles.checkoutButton}
                    onPress={goToCheckout}
                  >
                    <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyCartContainer}>
                <ShoppingCart size={48} color={COLORS.border} />
                <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
                <TouchableOpacity 
                  style={styles.continueShoppingButton}
                  onPress={() => setCartModalVisible(false)}
                >
                  <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Modal de Proceso de Pago */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutModalVisible}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Proceso de Pago</Text>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.checkoutSection}>
              <Text style={styles.checkoutSectionTitle}>Elige un método de pago</Text>
              
              <TouchableOpacity 
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'mercadopago' && styles.selectedPaymentMethod
                ]}
                onPress={() => setPaymentMethod('mercadopago')}
              >
                <Text style={styles.paymentMethodText}>MercadoPago</Text>
                {paymentMethod === 'mercadopago' && (
                  <Check size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'tarjeta' && styles.selectedPaymentMethod
                ]}
                onPress={() => setPaymentMethod('tarjeta')}
              >
                <Text style={styles.paymentMethodText}>Tarjeta de Crédito/Débito</Text>
                {paymentMethod === 'tarjeta' && (
                  <Check size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.paymentMethodButton,
                  paymentMethod === 'transferencia' && styles.selectedPaymentMethod
                ]}
                onPress={() => setPaymentMethod('transferencia')}
              >
                <Text style={styles.paymentMethodText}>Transferencia Bancaria</Text>
                {paymentMethod === 'transferencia' && (
                  <Check size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              
              <View style={styles.checkoutSummary}>
                <Text style={styles.checkoutTotal}>Total a pagar: ${cartTotal.toLocaleString()}</Text>
                <TouchableOpacity 
                  style={[
                    styles.processPaymentButton,
                    !paymentMethod && styles.disabledButton
                  ]}
                  onPress={processPayment}
                  disabled={!paymentMethod}
                >
                  <Text style={styles.processPaymentText}>
                    Procesar Pago
                  </Text>
                  <ArrowRight size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal de Confirmación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmationModal}>
            <View style={styles.confirmationIconContainer}>
              <Check size={60} color="#4CAF50" />
            </View>
            
            <Text style={styles.confirmationTitle}>¡Compra Exitosa!</Text>
            <Text style={styles.confirmationText}>
              Tu compra ha sido procesada correctamente. Podrás ver tus tickets y productos en la sección "Mis Tickets".
            </Text>
            
            <TouchableOpacity 
              style={styles.confirmationButton}
              onPress={finishPurchase}
            >
              <Text style={styles.confirmationButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  bannerContainer: {
    position: 'relative',
    height: 180,
    width: '100%',
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  bannerMainText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSubText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
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
    padding: 4,
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
    paddingVertical: 6,
    paddingHorizontal: 14,
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
    fontWeight: '600',
  },
  inactiveCategoryText: {
    color: COLORS.textSecondary,
  },
  featuredSection: {
    padding: 16,
    paddingBottom: 0,
  },
  productsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  featuredProductCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredProductImage: {
    width: '100%',
    height: 180,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productContent: {
    padding: 12,
  },
  featuredProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  productDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  stockContainer: {
    marginBottom: 8,
  },
  stockBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: 2,
  },
  stockText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
  },
  emptyStateSubtext: {
    color: COLORS.border,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
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
  floatingButtonText: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    color: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 6,
  },
  cartSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginVertical: 16,
  },
  continueShoppingButton: {
    backgroundColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  continueShoppingText: {
    color: COLORS.text,
    fontSize: 14,
  },
  checkoutSection: {
    padding: 16,
  },
  checkoutSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  paymentMethodText: {
    fontSize: 14,
    color: COLORS.text,
  },
  checkoutSummary: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  processPaymentButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  processPaymentText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  confirmationModal: {
    margin: 20,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmationIconContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  confirmationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmationButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShopScreen;