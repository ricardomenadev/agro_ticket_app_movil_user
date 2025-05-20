import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  Image 
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { FaTicketAlt, FaCar, FaShoppingCart } from 'lucide-react-native';

const OrderSummary = ({ cartItems, total }) => {
  // Función para formatear precios
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '0';
    }
    return price.toLocaleString();
  };
  
  // Renderizar imagen o ícono según el tipo de producto
  const renderItemImage = (item) => {
    if (item.tipo === 'ticket') {
      return (
        <View style={styles.iconContainer}>
          <FaTicketAlt size={24} color={COLORS.primary} />
        </View>
      );
    } else if (item.tipo === 'parking') {
      return (
        <View style={styles.iconContainer}>
          <FaCar size={24} color={COLORS.primary} />
        </View>
      );
    } else if (item.imagen) {
      return (
        <Image
          source={{ uri: item.imagen }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={styles.iconContainer}>
          <FaShoppingCart size={24} color={COLORS.primary} />
        </View>
      );
    }
  };
  
  // Renderizar un item del carrito
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        {renderItemImage(item)}
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.nombre || "Producto sin nombre"}
        </Text>
        <Text style={styles.itemQuantity}>
          {item.cantidad || 1} x ${formatPrice(item.precio || 0)}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        ${formatPrice((item.precio || 0) * (item.cantidad || 1))}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumen de Compra</Text>
      
      {cartItems && cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            style={styles.list}
            scrollEnabled={false}
          />
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${formatPrice(total)}</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay productos en el carrito
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginRight: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}20`,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});

export default OrderSummary;