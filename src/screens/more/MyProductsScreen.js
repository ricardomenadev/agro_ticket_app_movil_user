// src/screens/more/MyProductsScreen.js
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../constants/colors';

// Datos de ejemplo de productos
const products = [
  {
    id: 'P1001',
    name: 'Mate AGRONEA 2025',
    description: 'Mate oficial del evento',
    pickup: 'Stand de merchandising',
    qrData: 'AGRONEA2025-P1001-MERCH',
    image: require('../../../assets/images/products/mate.png')
  },
  {
    id: 'P1002',
    name: 'Gorra Térmica',
    description: 'Gorra térmica oficial AGRONEA',
    pickup: 'Stand de merchandising',
    qrData: 'AGRONEA2025-P1002-MERCH',
    image: require('../../../assets/images/products/gorra.png')
  }
];

const ProductCard = ({ product }) => {
  return (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <Image source={product.image} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.pickupText}>
            <Text style={{fontWeight: 'bold'}}>Retirar en: </Text>
            {product.pickup}
          </Text>
        </View>
      </View>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={product.qrData}
          size={150}
          backgroundColor='white'
          color='black'
        />
      </View>
      
      <Text style={styles.productId}>ID: {product.id}</Text>
      
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Guardar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyProductsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Productos</Text>
        <Text style={styles.headerSubtitle}>
          Presenta estos códigos QR para retirar tus productos
        </Text>
      </View>
      
      {products.length > 0 ? (
        <View style={styles.productsContainer}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-handle-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No tienes productos para retirar</Text>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  pickupText: {
    fontSize: 14,
    color: COLORS.text,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
  },
  productId: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyProductsScreen;