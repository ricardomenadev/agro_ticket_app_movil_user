// src/components/exhibitors/profile/ProductsSection.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../../constants/colors';
import EmptyState from '../shared/EmptyState';

const ProductsSection = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <EmptyState 
        message="No hay productos disponibles"
        description="Este expositor aún no ha publicado productos"
      />
    );
  }

  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  const baseBackendUrl = __DEV__ 
    ? 'https://19b278b633aa.ngrok-free.app'
    : 'https://api.agronea.store';
  
// Manejar URLs de localhost (reemplazarlas con ngrok)
  if (imagePath.startsWith("http://localhost:5000")) {
    return imagePath.replace("http://localhost:5000", baseBackendUrl);
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  if (imagePath.startsWith("/uploads")) {
    return `${baseBackendUrl}${imagePath}`;
  }
  
  return imagePath;
};

const getProductImage = (producto) => {
  console.log('Processing product:', producto.name);
  console.log('Images array:', producto.images);
  
  let rawImageUrl = null;
  
  // Obtener la URL cruda de la imagen
  if (producto.images && producto.images.length > 0) {
    const primaryImage = producto.images.find(img => img.isPrimary);
    rawImageUrl = primaryImage ? primaryImage.url : producto.images[0].url;
    console.log('Raw image URL from images array:', rawImageUrl);
  } else if (producto.image) {
    rawImageUrl = producto.image;
    console.log('Raw image URL from direct field:', rawImageUrl);
  }
  
  // Procesar la URL para que sea accesible
  const processedUrl = getImageUrl(rawImageUrl);
  console.log('Final processed URL:', processedUrl);
  
  return processedUrl;
};

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Productos</Text>
      {products.map(product => (
        <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.9}>
          {product.image && (
            <Image 
              source={{ uri: getProductImage(product) }}
              style={styles.productImage}
              defaultSource={require('../../../../assets/images/placeholder.png')}
            />
          )}
          <View style={styles.productContent}>
            <Text style={styles.productName}>{product.name}</Text>
            {product.description && (
              <Text style={styles.productDescription}>{product.description}</Text>
            )}
            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity style={styles.productButton}>
                <Text style={styles.productButtonText}>Más info</Text>
                <ChevronRight size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 16,
  },
  productName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 143, 60, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  productButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
});

export default ProductsSection;