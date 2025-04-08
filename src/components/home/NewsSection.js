import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';

// Datos de ejemplo de noticias
const news = [
  {
    id: '1',
    title: 'AGRONEA 2025 será la feria agrícola más grande de la región',
    summary: 'Con más de 300 expositores confirmados, la feria promete reunir lo mejor del sector agropecuario.',
    date: '15 de Marzo, 2025',
    image: require('../../../assets/images/news/news1.jpg'),
    isNew: true
  },
  {
    id: '2',
    title: 'Nuevas tecnologías de riego serán presentadas en AGRONEA',
    summary: 'Los principales fabricantes mostrarán sistemas de riego inteligentes que permiten ahorrar hasta un 30% de agua.',
    date: '10 de Marzo, 2025',
    image: require('../../../assets/images/news/news2.jpeg'),
    isNew: true
  },
  {
    id: '3',
    title: 'Panel sobre sustentabilidad agrícola',
    summary: 'Expertos internacionales debatirán sobre el futuro de la agricultura sostenible y sus desafíos.',
    date: '5 de Marzo, 2025',
    image: require('../../../assets/images/news/news3.jpeg'),
    isNew: false
  }
];

const NewsCard = ({ item, onPress }) => {
  const [animation] = useState(new Animated.Value(0));
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);
  
  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0]
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <Animated.View
      style={[
        styles.newsCard,
        {
          opacity,
          transform: [{ translateX }]
        }
      ]}
    >
      <View style={styles.newsImageContainer}>
        <Image 
          source={item.image} 
          style={styles.newsImage} 
          resizeMode="cover"
        />
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NUEVO</Text>
          </View>
        )}
      </View>
      
      <View style={styles.newsContent}>
        <View style={styles.dateContainer}>
          <Calendar size={12} color={COLORS.textSecondary} style={styles.dateIcon} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        
        <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={3}>{item.summary}</Text>
        
        <TouchableOpacity style={styles.readMoreButton} onPress={onPress}>
          <Text style={styles.readMoreText}>Leer más</Text>
          <ChevronRight size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const NewsSection = () => {
  const handleReadMore = (item) => {
    // Aquí iría la navegación a la pantalla de detalle de noticia
    console.log(`Read more about: ${item.title}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Últimas Noticias</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.newsContainer}>
        {news.map((item) => (
          <NewsCard 
            key={item.id} 
            item={item} 
            onPress={() => handleReadMore(item)} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
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
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  newsContainer: {
    marginTop: 8,
  },
  newsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newsImageContainer: {
    position: 'relative',
    height: 160,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  newsContent: {
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  newsSummary: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 5,
  },
});

export default NewsSection;