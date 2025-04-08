import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { ShoppingCart, PlusCircle, Star } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';

// Ejemplo de datos de productos
const featuredProducts = [
  {
    id: '1',
    name: 'Gorra AGRONEA',
    description: 'Gorra oficial color negro con logo bordado',
    price: 2500,
    image: require('../../../assets/images/products/gorra.png'),
    rating: 4.5,
    stock: 25
  },
  {
    id: '2',
    name: 'Mochila AGRONEA',
    description: 'Mochila resistente con múltiples compartimentos',
    price: 8900,
    image: require('../../../assets/images/products/mochila.png'),
    rating: 4.8,
    stock: 15
  },
  {
    id: '3',
    name: 'Camiseta AGRONEA',
    description: 'Camiseta 100% algodón con logo en el pecho',
    price: 3500,
    image: require('../../../assets/images/products/remera.png'),
    rating: 4.2,
    stock: 50
  },
];

const FeaturedProductCard = ({ product, onAddToCart }) => {
  const [animation] = useState(new Animated.Value(0));
  const [animationButton] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic)
    }).start();
    
    // Botón pulsante
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationButton, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        }),
        Animated.timing(animationButton, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease)
        })
      ])
    ).start();
  }, []);
  
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1]
  });
  
  const buttonScale = animationButton.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1]
  });

  return (
    <Animated.View 
      style={[
        styles.productCard, 
        { 
          opacity, 
          transform: [{ translateY }] 
        }
      ]}
    >
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Destacado</Text>
        </View>
      </View>
      
      <Image 
        source={product.image} 
        style={styles.productImage} 
        resizeMode="contain"
      />
      
      <View style={styles.productContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={12} 
              color={star <= Math.floor(product.rating) ? COLORS.secondary : COLORS.border}
              fill={star <= Math.floor(product.rating) ? COLORS.secondary : 'none'}
            />
          ))}
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>${product.price.toLocaleString()}</Text>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => onAddToCart(product)}
            >
              <PlusCircle size={18} color={COLORS.text} />
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <View style={styles.stockContainer}>
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockFill, 
                { 
                  width: `${Math.min(100, (product.stock / 50) * 100)}%`,
                  backgroundColor: product.stock < 10 ? COLORS.error : product.stock < 20 ? COLORS.warning : COLORS.primary 
                }
              ]} 
            />
          </View>
          <Text style={styles.stockText}>{product.stock} disponibles</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const FeaturedProducts = () => {
  const [cartItems, setCartItems] = useState(0);
  
  const addToCart = (product) => {
    setCartItems(cartItems + 1);
    // Aquí puedes implementar la lógica real de añadir al carrito
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos Destacados</Text>
        <TouchableOpacity style={styles.cartButton}>
          <ShoppingCart size={18} color={COLORS.text} />
          {cartItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.productsContainer}>
        {featuredProducts.map((product) => (
          <FeaturedProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cartButton: {
    position: 'relative',
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productsContainer: {
    marginTop: 10,
  },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.background,
  },
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockContainer: {
    marginTop: 6,
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
});

export default FeaturedProducts;