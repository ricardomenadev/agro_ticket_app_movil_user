import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={product.image ? { uri: product.image } : { uri: 'https://via.placeholder.com/300x200' }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${product.price.toLocaleString()}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddToCart}
          >
            <PlusCircle size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: 128,
    backgroundColor: COLORS.border,
  },
  content: {
    padding: 12,
  },
  name: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 14,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductCard;