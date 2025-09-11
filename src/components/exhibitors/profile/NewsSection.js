// src/components/exhibitors/profile/NewsSection.js
import React, { useState } from 'react';
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
import NewsDetailModal from './modals/NewsDetailModal';

const NewsSection = ({ news = [] }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (news.length === 0) {
    return (
      <EmptyState
        message="No hay noticias disponibles"
        description="Este expositor aún no ha publicado novedades"
      />
    );
  }

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

  // Manejar clic en noticia
  const handleNewsPress = (newsItem) => {
    setSelectedNews(newsItem);
    setModalVisible(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Últimas Novedades</Text>
      {news.map(item => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.newsCard} 
          activeOpacity={0.9}
          onPress={() => handleNewsPress(item)}
        >
          {item.image && (
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={styles.newsImage}
              defaultSource={require('../../../../assets/images/placeholder.png')}
            />
          )}
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>{item.date}</Text>
            <Text style={styles.newsTitle}>{item.title}</Text>
            {item.summary && (
              <Text style={styles.newsSummary} numberOfLines={3}>
                {item.summary}
              </Text>
            )}
            <TouchableOpacity 
              style={styles.newsButton}
              onPress={() => handleNewsPress(item)}
            >
              <Text style={styles.newsButtonText}>Leer más</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* Modal de detalles */}
      <NewsDetailModal
        visible={modalVisible}
        news={selectedNews}
        onClose={handleCloseModal}
      />
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
  newsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newsImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  newsDate: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 8,
  },
  newsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsSummary: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  newsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  newsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
});

export default NewsSection;