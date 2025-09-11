// src/components/exhibitors/profile/modals/NewsDetailModal.js
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { X, Calendar, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../../../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NewsDetailModal = ({ visible, news, onClose }) => {
  if (!news) return null;

  // Función para obtener URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
   
    const baseBackendUrl = __DEV__
      ? 'https://19b278b633aa.ngrok-free.app'
      : 'https://api.agronea.store';
   
    // Manejar URLs de localhost
    if (imagePath.startsWith("http://localhost:5000")) {
      return imagePath.replace("http://localhost:5000", baseBackendUrl);
    }
   
    // URLs completas
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
   
    // Rutas relativas
    if (imagePath.startsWith("/uploads")) {
      return `${baseBackendUrl}${imagePath}`;
    }
   
    return `${baseBackendUrl}/${imagePath}`;
  };

  // Formatear fecha completa
  const formatFullDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      // Si ya viene formateada del backend, usarla
      if (typeof dateString === 'string' && dateString.includes('de')) {
        return dateString;
      }
      
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || 'Fecha no disponible';
    }
  };

  const handleShare = () => {
    // Aquí podrías implementar la funcionalidad de compartir
    console.log('Compartir noticia:', news.title);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, '#B8860B']}
          style={styles.modalHeader}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>Novedad</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                <Share2 size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <ScrollView 
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {/* News Image */}
          {news.image && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: getImageUrl(news.image) }}
                style={styles.newsImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* News Content */}
          <View style={styles.contentContainer}>
            {/* Date */}
            <View style={styles.dateContainer}>
              <Calendar size={16} color={COLORS.secondary} />
              <Text style={styles.newsDate}>
                {formatFullDate(news.date || news.publishDate)}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.newsTitle}>{news.title}</Text>

            {/* Summary */}
            {news.summary && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Resumen</Text>
                <Text style={styles.newsSummary}>{news.summary}</Text>
              </View>
            )}

            {/* Full Content - Si tienes un campo content en tu API */}
            {news.content && (
              <View style={styles.fullContentContainer}>
                <Text style={styles.fullContent}>{news.content}</Text>
              </View>
            )}

            {/* Si no hay contenido completo, mostrar mensaje */}
            {!news.content && news.summary && (
              <View style={styles.noContentContainer}>
                <Text style={styles.noContentText}>
                  Esta es toda la información disponible para esta noticia.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.card,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsDate: {
    color: COLORS.secondary,
    fontSize: 14,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  newsTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsSummary: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  fullContentContainer: {
    marginBottom: 20,
  },
  fullContent: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  noContentContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noContentText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default NewsDetailModal;