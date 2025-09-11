import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

const exhibitorLogos = [
  { id: '1', name: 'ACA', logo: require('../../../assets/images/auspiciantes/ACA-AUSPICIANTE.png') },
  { id: '2', name: 'AGROCOR', logo: require('../../../assets/images/auspiciantes/AGROCOR-AUSPICIANTE.png') },
  { id: '3', name: 'LANGELOTTI SRL', logo: require('../../../assets/images/auspiciantes/LANGELLOTI-AUSPICIANTE.png') },
];

const FeaturedExhibitors = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Duplicamos el array 3 veces para efecto infinito
  const infiniteExhibitors = [...exhibitorLogos, ...exhibitorLogos, ...exhibitorLogos];
  const itemWidth = screenWidth * 0.8;
  const itemSpacing = 16; // marginHorizontal * 2
  const snapInterval = itemWidth + itemSpacing;

  useEffect(() => {
    // Comenzar desde una posición aleatoria
    const randomStartIndex = Math.floor(Math.random() * exhibitorLogos.length) + exhibitorLogos.length;
    setCurrentIndex(randomStartIndex);
    
    // Scroll inicial a posición aleatoria
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: randomStartIndex,
          animated: false
        });
      }
    }, 100);

    // Auto-scroll infinito
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true
          });
        }
        
        // Reset al centro cuando llegue al final
        if (nextIndex >= infiniteExhibitors.length - exhibitorLogos.length) {
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: exhibitorLogos.length,
                animated: false
              });
            }
            setCurrentIndex(exhibitorLogos.length);
          }, 500);
        }
        
        return nextIndex;
      });
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(timer);
  }, []);

  const renderExhibitor = ({ item, index }) => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp'
    });

    // Removemos opacity para que todas las tarjetas mantengan fondo blanco

    return (
      <TouchableOpacity style={styles.exhibitorItem}>
        <Animated.View style={[
          styles.exhibitorCard, 
          { transform: [{ scale }] }
        ]}>
          <Image
            source={item.logo}
            style={styles.exhibitorLogo}
            resizeMode="contain"
          />
          <Text style={styles.exhibitorName}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => ({
    length: snapInterval,
    offset: snapInterval * index,
    index,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Auspiciantes AGRONEA</Text>
      </View>
     
      <FlatList
        ref={flatListRef}
        data={infiniteExhibitors}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderExhibitor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={snapInterval}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onScrollEndDrag={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / snapInterval);
          setCurrentIndex(newIndex);
        }}
        removeClippedSubviews={false}
        initialScrollIndex={0}
      />

      {/* Indicadores de puntos */}
      <View style={styles.dotsContainer}>
        {exhibitorLogos.map((_, index) => {
          const dotOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, { opacity: dotOpacity }]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listContent: {
    paddingLeft: (screenWidth - screenWidth * 0.8) / 2 - 10, // Menos margen izquierdo
    paddingRight: (screenWidth - screenWidth * 0.8) / 2 + 20, // Más margen derecho
  },
  exhibitorItem: {
    width: screenWidth * 0.8,
    marginHorizontal: 8,
  },
  exhibitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    height: 200,
    justifyContent: 'center',
  },
  exhibitorLogo: {
    width: '90%',
    height: '70%',
    marginBottom: 10,
  },
  exhibitorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
});

export default FeaturedExhibitors;