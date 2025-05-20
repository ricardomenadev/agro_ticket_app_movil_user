import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

// SVG componentes para tickets (versiones simplificadas)
const GeneralTicketSVG = (props) => (
  <View style={{
    width: props.width || '100%', 
    height: props.height || '100%', 
    backgroundColor: '#0A8F3C20', 
    justifyContent: 'center', 
    alignItems: 'center'
  }}>
    <Text style={{color: COLORS.primary || '#0A8F3C', fontWeight: 'bold'}}>
      🎫 Entrada General
    </Text>
  </View>
);

const ParkingTicketSVG = (props) => (
  <View style={{
    width: props.width || '100%', 
    height: props.height || '100%', 
    backgroundColor: '#0066CC20', 
    justifyContent: 'center', 
    alignItems: 'center'
  }}>
    <Text style={{color: '#0066CC', fontWeight: 'bold'}}>
      🚗 Estacionamiento
    </Text>
  </View>
);

const ProductCard = ({ product, onAddToCart, onPress, featured = false }) => {
  // Renderizar la imagen adecuada (SVG o URI)
  const renderImage = () => {
    if (product.tipo === 'ticket') {
      return <GeneralTicketSVG width="100%" height={featured ? 180 : 120} />;
    } else if (product.tipo === 'parking') {
      return <ParkingTicketSVG width="100%" height={featured ? 180 : 120} />;
    } else {
      // Si hay una imagen, intentar mostrarla
      if (product.imagen && typeof product.imagen === 'string') {
        // Asegúrate de que la URL sea completa
        let imageUrl = product.imagen;
        
        // Si la imagen no comienza con http, añadir URL base del servidor
        if (!imageUrl.startsWith('http')) {
          // Usa la URL base de tu API
          const API_BASE_URL = 'https://140e-181-105-226-40.ngrok-free.app/api/mobile'; // Ajusta según corresponda
          imageUrl = `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }
        
        console.log("URL de imagen:", imageUrl); // Debugging
        
        return (
          <Image
            source={{ uri: imageUrl }}
            style={featured ? styles.featuredProductImage : styles.productImage}
            resizeMode="cover"
            onError={(e) => console.log(`Error cargando imagen (${imageUrl}):`, e.nativeEvent.error)}
          />
        );
      } else {
        // Si no hay imagen, mostrar un placeholder
        return (
          <View style={[
            featured ? styles.featuredProductImage : styles.productImage,
            { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.border || '#333333' }
          ]}>
            <Text style={{ color: COLORS.text || '#FFFFFF' }}>
              Imagen no disponible
            </Text>
          </View>
        );
      }
    }
  };

  // Decidir si mostrar el precio formateado
  const formattedPrice = typeof product.precio === 'number' 
    ? product.precio.toLocaleString() 
    : product.precio || '0';

  return (
    <TouchableOpacity
      style={featured ? styles.featuredProductCard : styles.productCard}
      activeOpacity={0.9}
      onPress={() => onPress(product)}
    >
      {featured && product.destacado && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Destacado</Text>
          </View>
        </View>
      )}

      <View
        style={
          featured
            ? styles.featuredProductImageContainer
            : styles.productImageContainer
        }
      >
        {renderImage()}
      </View>

      <View style={styles.productContent}>
        <Text
          style={featured ? styles.featuredProductName : styles.productName}
          numberOfLines={2}
        >
          {product.nombre}
        </Text>

        <Text style={styles.productDescription} numberOfLines={2}>
          {product.descripcion}
        </Text>

        {product.stock !== undefined && (
          <View style={styles.stockContainer}>
            <View style={styles.stockBar}>
              <View
                style={[
                  styles.stockFill,
                  {
                    width: `${Math.min(100, (product.stock / 200) * 100)}%`,
                    backgroundColor:
                      product.stock < 10
                        ? "#ff4d4d"
                        : product.stock < 30
                        ? "#ffbb33"
                        : COLORS.primary || '#0A8F3C',
                  },
                ]}
              />
            </View>
            <Text style={styles.stockText}>{product.stock} disponibles</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={featured ? styles.featuredPrice : styles.price}>
            ${formattedPrice}
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart size={featured ? 20 : 18} color={COLORS.text || '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredProductCard: {
    backgroundColor: COLORS.card || '#1E1E1E',
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border || '#333333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  productCard: {
    backgroundColor: COLORS.card || '#1E1E1E',
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border || '#333333',
  },
  badgeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  badge: {
    backgroundColor: COLORS.primary || '#0A8F3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.text || '#FFFFFF',
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredProductImageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.border || '#333333',
  },
  productImageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.border || '#333333',
  },
  featuredProductImage: {
    width: "100%",
    height: 180,
  },
  productImage: {
    width: "100%",
    height: 120,
  },
  productContent: {
    padding: 12,
  },
  featuredProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text || '#FFFFFF',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text || '#FFFFFF',
    marginBottom: 2,
    height: 40,
  },
  productDescription: {
    color: COLORS.textSecondary || '#AAAAAA',
    fontSize: 12,
    marginBottom: 8,
    height: 32,
  },
  stockContainer: {
    marginBottom: 8,
  },
  stockBar: {
    height: 4,
    backgroundColor: COLORS.border || '#333333',
    borderRadius: 2,
    marginBottom: 4,
    overflow: "hidden",
  },
  stockFill: {
    height: "100%",
    borderRadius: 2,
  },
  stockText: {
    fontSize: 10,
    color: COLORS.textSecondary || '#AAAAAA',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary || '#0A8F3C',
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary || '#0A8F3C',
  },
  addButton: {
    backgroundColor: COLORS.primary || '#0A8F3C',
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductCard;