import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

// Array de imágenes - agrega aquí las tuyas
const galleryImages = [
  { id: '1', source: require('../../../assets/images/sponsors/DONNET.png') },
  { id: '2', source: require('../../../assets/images/sponsors/GOBIERNO.png') },
  { id: '3', source: require('../../../assets/images/sponsors/COMBUSTIBLE.png') },
  { id: '4', source: require('../../../assets/images/sponsors/GRUPOABS.png') },
  { id: '5', source: require('../../../assets/images/sponsors/LOGTRANS.png') },
  { id: '6', source: require('../../../assets/images/sponsors/MUNICIPALIDAD.png') },
  { id: '7', source: require('../../../assets/images/sponsors/PARRA-SPONSOR.png') },
];

const RandomImagesCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Duplicamos el array 3 veces para efecto infinito
  const infiniteImages = [...galleryImages, ...galleryImages, ...galleryImages];
  const itemWidth = screenWidth * 0.8;
  const itemSpacing = 16; // marginHorizontal * 2
  const snapInterval = itemWidth + itemSpacing;

  useEffect(() => {
    // Comenzar desde una posición aleatoria
    const randomStartIndex = Math.floor(Math.random() * galleryImages.length) + galleryImages.length;
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
        if (nextIndex >= infiniteImages.length - galleryImages.length) {
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: galleryImages.length,
                animated: false
              });
            }
            setCurrentIndex(galleryImages.length);
          }, 500);
        }
        
        return nextIndex;
      });
    }, 3500); // Cambia cada 3.5 segundos

    return () => clearInterval(timer);
  }, []);

  const renderImage = ({ item, index }) => {
    const inputRange = [
      (index - 1) * snapInterval,
      index * snapInterval,
      (index + 1) * snapInterval
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp'
    });

    // const opacity = scrollX.interpolate({
    //   inputRange,
    //   outputRange: [0.7, 1, 0.7],
    //   extrapolate: 'clamp'
    // });

    return (
      <Animated.View style={[styles.imageContainer, { transform: [{ scale }] }]}>
        <Image
          source={item.source}
          style={styles.carouselImage}
          resizeMode="contain"
        />
      </Animated.View>
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
        <Text style={styles.title}>Sponsors AGRONEA</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={infiniteImages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderImage}
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
      />

      {/* Indicadores de puntos */}
      <View style={styles.dotsContainer}>
        {galleryImages.map((_, index) => {
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
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
  paddingLeft: (screenWidth - screenWidth * 0.8) / 2 - 10, // Menos margen izquierdo
  paddingRight: (screenWidth - screenWidth * 0.8) / 2 + 20, // Más margen derecho
},
  imageContainer: {
    width: screenWidth * 0.8,
    height: 200,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: '#FFFFFF',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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

export default RandomImagesCarousel;