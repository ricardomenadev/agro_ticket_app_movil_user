import React, { useState, useEffect } from "react";
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
  Animated,
  ActivityIndicator,
  Platform
} from "react-native";
import {
  Search,
  X,
  ShoppingCart,
  Trash2,
  Check,
  ArrowRight,
} from "lucide-react-native";
import ProductCard from "../../components/shop/ProductCard";
import ProductDetailModal from "../../components/shop/ProductDetailModal";
import { COLORS } from "../../constants/colors";
import {
  GeneralTicketSVG,
  ParkingTicketSVG,
} from "../../components/svgs/EventTicketSVGs";
import { useStore } from "../../context/StoreContext";

const productCategories = [
  { id: "all", name: "Todos" },
  { id: "tickets", name: "Entradas" },
  { id: "parking", name: "Estacionamiento" },
  { id: "clothing", name: "Indumentaria" },
  { id: "accessories", name: "Accesorios" },
  { id: "souvenirs", name: "Recuerdos" },
];

const ShopScreen = ({ navigation }) => {
  // Estados locales
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailVisible, setProductDetailVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  // Obtener datos del contexto
  const {
    state,
    loading,
    error,
    products,
    events,
    addItem,
    removeItem,
    updateQuantity,
    loadEvents,
    loadProducts,
    total,
    loadEventDetails,
  } = useStore();

  const { items: cartItems = [] } = state.cart || {};

  // Cargar datos iniciales
  useEffect(() => {
    loadEvents();
    loadProducts();
  }, []);

  // Establecer evento seleccionado por defecto
  useEffect(() => {
    if (events && events.length > 0 && !selectedEvent) {
      console.log("🔄 Estableciendo primer evento por defecto:", events[0].id);
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Cargar detalles del evento seleccionado - osea los productos asociados
  useEffect(() => {
    const loadEventWithDetails = async () => {
      if (selectedEventId) {
        console.log("🔄 Cargando detalles para evento:", selectedEventId);
        const eventDetails = await loadEventDetails(selectedEventId);
        console.log("✅ Detalles recibidos:", eventDetails);
        setSelectedEvent(eventDetails); // Usar los detalles completos
      }
    };

    loadEventWithDetails();
  }, [selectedEventId, loadEventDetails]);

  // Filtrar productos según búsqueda y categoría
  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.categoria === activeCategory) &&
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Obtener productos destacados
  const featuredProducts = products.filter((product) => product.destacado);

  // Función para agregar al carrito
  const handleAddToCart = (product) => {
    addItem(product, 1);
  };

  // Función para remover del carrito
  const handleRemoveFromCart = (index) => {
    const itemId = cartItems[index].id;
    removeItem(itemId);
  };

  // Función para abrir el detalle de un producto
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setProductDetailVisible(true);
  };

  // Función para determinar si un producto está en el carrito
  const isInCart = (product) => {
    return cartItems.some((item) => item.id === product.id);
  };

  // Renderizar SVG de tickets
  const renderTicketSVG = (ticketType) => {
    if (ticketType === "parking") {
      return <ParkingTicketSVG width="100%" height="100%" />;
    }
    return <GeneralTicketSVG width="100%" height="100%" />;
  };

  // Componente para la selección de eventos
  const EventSelector = () => {
    if (!events || events.length === 0) return null;
    if (events.length === 1) {
      return (
        <View style={styles.singleEventBanner}>
          <Text style={styles.singleEventText}>{events[0].title}</Text>
        </View>
      );
    }

    return (
      <View style={styles.eventSelectorContainer}>
        <Text style={styles.eventSelectorLabel}>Selecciona un evento:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.eventButton,
                selectedEvent?.id === event.id
                  ? styles.selectedEventButton
                  : {},
              ]}
              onPress={() => setSelectedEvent(event)}
            >
              <Text
                style={[
                  styles.eventButtonText,
                  selectedEvent?.id === event.id
                    ? styles.selectedEventText
                    : {},
                ]}
              >
                {event.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Componente para estado de carga
  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </SafeAreaView>
    );
  }

  // Componente principal
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Banner del evento */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../../assets/images/logos/agronea-logo.png")}
            style={styles.bannerImageInside}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerMainText}>
              AGRONEA 2025 - Tienda Oficial
            </Text>
            <Text style={styles.bannerSubText}>
              Adquiere tus entradas y productos oficiales
            </Text>
          </View>
        </View>

        {/* Selector de eventos si hay más de uno */}
        <EventSelector />

        {/* Encabezado */}
        <View style={styles.header}>
          {/* Barra de búsqueda
          <View style={styles.searchBar}>
            <Search
              size={20}
              color={COLORS.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View> */}

          {/* Filtros por categoría
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {productCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id
                    ? styles.activeCategoryButton
                    : styles.inactiveCategoryButton,
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category.id
                      ? styles.activeCategoryText
                      : styles.inactiveCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
        </View>

        {/* Sección de tickets si hay evento seleccionado */}
        {selectedEvent && (
          <View style={styles.ticketsSection}>
            <Text style={styles.sectionTitle}>Entradas - Estacionamientos</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ticketsScrollContainer}
            >
              {/* Ticket general */}
              {selectedEvent.ticket && (
                <View style={[styles.ticketCard, styles.ticketCardHorizontal]}>
                  <View style={styles.ticketImageContainer}>
                    {renderTicketSVG("general")}
                  </View>
                  <View style={styles.ticketContent}>
                    <Text style={styles.ticketTitle}>
                      {selectedEvent.ticket.nombre}
                    </Text>
                    <Text style={styles.ticketDescription}>
                      {selectedEvent.ticket.descripcion}
                    </Text>
                    <View style={styles.ticketFooter}>
                      <Text style={styles.ticketPrice}>
                        ${selectedEvent.ticket.precio.toLocaleString()}
                      </Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddToCart(selectedEvent.ticket)}
                      >
                        <ShoppingCart size={18} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Estacionamiento para Vehículos */}
              {selectedEvent.parkingVehicle && (
                <View style={[styles.ticketCard, styles.ticketCardHorizontal]}>
                  <View style={styles.ticketImageContainer}>
                    {renderTicketSVG("parking")}
                  </View>
                  <View style={styles.ticketContent}>
                    <Text style={styles.ticketTitle}>
                      {selectedEvent.parkingVehicle.nombre}
                    </Text>
                    <Text style={styles.ticketDescription}>
                      {selectedEvent.parkingVehicle.descripcion}
                    </Text>
                    <View style={styles.ticketFooter}>
                      <Text style={styles.ticketPrice}>
                        ${selectedEvent.parkingVehicle.precio.toLocaleString()}
                      </Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                          handleAddToCart(selectedEvent.parkingVehicle)
                        }
                      >
                        <ShoppingCart size={18} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Estacionamiento para Motos */}
              {selectedEvent.parkingMoto && (
                <View style={[styles.ticketCard, styles.ticketCardHorizontal]}>
                  <View style={styles.ticketImageContainer}>
                    {renderTicketSVG("parking")}
                  </View>
                  <View style={styles.ticketContent}>
                    <Text style={styles.ticketTitle}>
                      {selectedEvent.parkingMoto.nombre}
                    </Text>
                    <Text style={styles.ticketDescription}>
                      {selectedEvent.parkingMoto.descripcion}
                    </Text>
                    <View style={styles.ticketFooter}>
                      <Text style={styles.ticketPrice}>
                        ${selectedEvent.parkingMoto.precio.toLocaleString()}
                      </Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                          handleAddToCart(selectedEvent.parkingMoto)
                        }
                      >
                        <ShoppingCart size={18} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Lista de productos */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {activeCategory === "all"
              ? "Productos Oficiales"
              : productCategories.find((c) => c.id === activeCategory)?.name ||
                "Productos"}
          </Text>

          {loading && <ActivityIndicator color={COLORS.primary} />}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.productsGrid}>
  {(() => {
    console.log('🔍 DEBUG: Total filteredProducts:', filteredProducts.length);
    console.log('🔍 DEBUG: activeCategory:', activeCategory);
    
    return filteredProducts.map((product, index) => {
      console.log(`🔍 DEBUG: Procesando producto ${index + 1}:`, {
        nombre: product.nombre,
        sku: product.sku || 'NO-SKU',
        tipo: product.tipo || 'NO-TIPO',
        destacado: product.destacado
      });
      
      // ✅ FILTRAR POR SKU PRIMERO (más confiable)
      if (product.sku) {
        const sku = product.sku.toLowerCase();
        const isTicketSku = sku.includes("ticket") || sku.includes("invitation");
        const isParkingSku = sku.includes("parking");
        
        if (isTicketSku || isParkingSku) {
          console.log('❌ Filtrando por SKU:', product.sku);
          return null;
        }
      }
      
      // ✅ FILTRAR POR TIPO COMO FALLBACK
      if (product.tipo === "ticket" || product.tipo === "parking") {
        console.log('❌ Filtrando por tipo:', product.tipo);
        return null;
      }
      
      // ✅ FILTRAR POR NOMBRE COMO ÚLTIMO RECURSO (para productos mal categorizados)
      const isTicketName = product.nombre.toLowerCase().includes('entrada') || 
                           product.nombre.toLowerCase().includes('invitación');
      const isParkingName = product.nombre.toLowerCase().includes('estacionamiento');
      
      if (isTicketName || isParkingName) {
        console.log('❌ Filtrando por nombre:', product.nombre);
        return null;
      }

      // No mostrar productos destacados en categoría 'all' para evitar duplicados
      if (activeCategory === "all" && product.destacado) {
        console.log('❌ Filtrando producto destacado en categoría "all":', product.nombre);
        return null;
      }

      console.log('✅ Mostrando producto:', product.nombre);
      return (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => handleAddToCart(product)}
          onPress={() => openProductDetail(product)}
          featured={false}
        />
      );
    });
  })()}
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

      {/* Modal de detalle de producto */}
      <ProductDetailModal
        product={selectedProduct}
        visible={productDetailVisible}
        onClose={() => setProductDetailVisible(false)}
        onAddToCart={() => {
          if (selectedProduct) handleAddToCart(selectedProduct);
        }}
        inCart={selectedProduct ? isInCart(selectedProduct) : false}
      />

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
                    <View style={styles.cartItem}>
                      <View style={styles.cartItemImageContainer}>
                        {item.tipo === "ticket" || item.tipo === "parking" ? (
                          renderTicketSVG(item.tipo)
                        ) : (
                          <Image
                            source={{ uri: item.imagen }}
                            style={styles.cartItemImage}
                            onError={(e) =>
                              console.log(
                                "Error cargando imagen en carrito:",
                                e.nativeEvent.error
                              )
                            }
                          />
                        )}
                      </View>
                      <View style={styles.cartItemContent}>
                        <Text style={styles.cartItemName}>{item.nombre}</Text>
                        <View style={styles.cartItemPriceRow}>
                          <Text style={styles.cartItemPrice}>
                            ${item.precio.toLocaleString()}
                          </Text>
                          <View style={styles.quantityContainer}>
                            <TouchableOpacity
                              onPress={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.cantidad - 1)
                                )
                              }
                            >
                              <Text style={styles.quantityButton}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>
                              {item.cantidad || 1}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                updateQuantity(item.id, item.cantidad + 1)
                              }
                            >
                              <Text style={styles.quantityButton}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveFromCart(index)}
                      >
                        <Trash2 size={18} color="#ff4d4d" />
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  style={styles.cartList}
                />

                <View style={styles.cartSummary}>
                  <Text style={styles.cartTotal}>
                    Total: ${total.toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => {
                      setCartModalVisible(false);
                      navigation.navigate("Checkout");
                    }}
                  >
                    <Text style={styles.checkoutButtonText}>
                      Finalizar Compra
                    </Text>
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
                  <Text style={styles.continueShoppingText}>
                    Continuar Comprando
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  ticketsScrollContainer: {
    paddingRight: 16,
  },
  ticketCardHorizontal: {
    width: 280, // Ancho fijo para cada tarjeta
    marginRight: 12, // Espacio entre tarjetas
  },
  bannerContainer: {
    height: 80,
    backgroundColor: "rgba(0,0,0,0.6)", // Fondo directo
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  bannerImageInside: {
    width: 60,
    height: 60,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerMainText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerSubText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  header: {
    padding: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  cartContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  inactiveCategoryButton: {
    backgroundColor: COLORS.card,
  },
  categoryText: {
    fontSize: 14,
  },
  activeCategoryText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  inactiveCategoryText: {
    color: COLORS.textSecondary,
  },
  productsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featuredSection: {
    padding: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    width: "100%",
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  floatingButton: {
    position: "absolute",
    bottom: 84,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingButtonText: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFFFFF",
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "bold",
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  modalBody: {
    flexGrow: 1,
  },
  productDetailImage: {
    height: 200,
    backgroundColor: COLORS.card,
  },
  productDetailContent: {
    padding: 16,
  },
  productDetailDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  productDetailPrice: {
    marginBottom: 16,
  },
  productDetailPriceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  cartList: {
    flexGrow: 1,
    maxHeight: "70%",
  },
  cartItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cartItemImageContainer: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  cartItemImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  cartItemPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    paddingHorizontal: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    width: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
    alignSelf: "center",
  },
  cartSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyCartContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    flex: 1,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 200,
  },
  continueShoppingText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.text,
    fontSize: 16,
  },
  singleEventBanner: {
    backgroundColor: COLORS.primary + "20",
    padding: 8,
    marginHorizontal: 16,
    borderRadius: 4,
    marginTop: 8,
  },
  singleEventText: {
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
  },
  eventSelectorContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  eventSelectorLabel: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
  },
  eventButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedEventButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  eventButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  selectedEventText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
  ticketsSection: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ticketImageContainer: {
    height: 150,
    backgroundColor: COLORS.background,
  },
  ticketContent: {
    padding: 16,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default ShopScreen;
