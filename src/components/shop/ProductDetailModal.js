import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import { X, ShoppingCart, CheckCircle } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { GeneralTicketSVG, VIPTicketSVG, ParkingTicketSVG } from '../svgs/EventTicketSVGs';

const ProductDetailModal = ({ product, visible, onClose, onAddToCart, inCart }) => {
  if (!product) return null;
  
  // Renderizar la imagen adecuada (SVG o URI)
  const renderImage = () => {
    if (product.svg === 'general') {
      return <GeneralTicketSVG width="100%" height={200} />;
    } else if (product.svg === 'vip') {
      return <VIPTicketSVG width="100%" height={200} />;
    } else if (product.svg === 'parking') {
      return <ParkingTicketSVG width="100%" height={200} />;
    } else {
      return (
        <Image 
          source={{ uri: product.image }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
      );
    }
  };
  
  // Renderizar detalles específicos según la categoría
  const renderDetails = () => {
    if (!product.details) return null;
    
    const detailsEntries = Object.entries(product.details);
    
    return (
      <View style={styles.detailsContainer}>
        {detailsEntries.map(([key, value], index) => (
          <View 
            key={key} 
            style={[
              styles.detailItem,
              index < detailsEntries.length - 1 ? styles.detailItemBorder : null
            ]}
          >
            <Text style={styles.detailLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{product.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.contentScroll}>
            <View style={styles.imageContainer}>
              {renderImage()}
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${product.price.toLocaleString()}</Text>
                <View style={styles.stockContainer}>
                  <View style={styles.stockIndicator}>
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
              </View>
              
              <Text style={styles.description}>{product.description}</Text>
              
              {/* Detalles del producto */}
              <Text style={styles.sectionTitle}>Detalles</Text>
              {renderDetails()}
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            {inCart ? (
              <TouchableOpacity 
                style={styles.inCartButton}
                activeOpacity={0.8}
              >
                <CheckCircle size={20} color={COLORS.text} />
                <Text style={styles.inCartButtonText}>En el carrito</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => {
                  onAddToCart(product);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <ShoppingCart size={20} color={COLORS.text} />
                <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  contentScroll: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: COLORS.border,
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockIndicator: {
    width: 100,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  stockFill: {
    height: '100%',
    borderRadius: 2,
  },
  stockText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  detailItem: {
    padding: 12,
  },
  detailItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  inCartButton: {
    backgroundColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  inCartButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProductDetailModal;