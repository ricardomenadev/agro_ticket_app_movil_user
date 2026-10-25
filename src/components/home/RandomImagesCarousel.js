import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

// --- SPONSORS ---
// Para agregar un sponsor nuevo:
//   1. Copiar la imagen a assets/images/sponsors/
//   2. Agregar una línea acá
const posterImages = [
  { id: 'akron',         source: require('../../../assets/images/sponsors/akron.png') },
  { id: 'case',          source: require('../../../assets/images/sponsors/case.png') },
  { id: 'forddonnet',    source: require('../../../assets/images/sponsors/forddonnet.png') },
  { id: 'gonar',         source: require('../../../assets/images/sponsors/gonar.png') },
  { id: 'iveco',         source: require('../../../assets/images/sponsors/iveco.png') },
  { id: 'lovol',         source: require('../../../assets/images/sponsors/lovol.png') },
  { id: 'nbch',        source: require('../../../assets/images/sponsors/nbch.jpg') },
  { id: 'maquinagro',    source: require('../../../assets/images/sponsors/maquinagro.png') },
  { id: 'nordemaq',      source: require('../../../assets/images/sponsors/nordemaq.png') },
  { id: 'nortesemillas', source: require('../../../assets/images/sponsors/nortesemillas.png') },
  { id: 'ombu',          source: require('../../../assets/images/sponsors/ombu.png') },
  { id: 'ryl',           source: require('../../../assets/images/sponsors/ryl.png') },
  { id: 'super',         source: require('../../../assets/images/sponsors/super.png') },
  
  { id: 'sartor',       source: require('../../../assets/images/sponsors/sartor.jpg') },
  { id: 'morelli',        source: require('../../../assets/images/sponsors/morelli.jpg') },
  { id: 'demagro',        source: require('../../../assets/images/sponsors/demagro.jpg') },
];

// Proporción del poster: 4:5 (ancho x alto)
const CARD_WIDTH = screenWidth * 0.62;
const CARD_HEIGHT = CARD_WIDTH * 1.25;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

const RandomImagesCarousel = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Inicio aleatorio calculado una sola vez — useMemo evita recalcular en cada render
  const randomStart = useMemo(
    () => posterImages.length + Math.floor(Math.random() * posterImages.length),
    [],
  );

  const infinitePosters = useMemo(
    () => [...posterImages, ...posterImages, ...posterImages],
    [],
  );

  const START_INDEX = posterImages.length;

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current && posterImages.length > 1) {
        flatListRef.current.scrollToIndex({ index: randomStart, animated: false });
      }
    }, 100);
    setCurrentIndex(randomStart);

    if (posterImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: next, animated: true });
        }

        if (next >= infinitePosters.length - posterImages.length) {
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index: START_INDEX,
                animated: false,
              });
            }
            setCurrentIndex(START_INDEX);
          }, 450);
        }

        return next;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const renderPoster = ({ item, index }) => {
    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.88, 1, 0.88],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.55, 1, 0.55],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.cardWrapper,
          { transform: [{ scale }], opacity },
        ]}
      >
        <Image
          source={item.source}
          style={styles.posterImage}
          resizeMode="cover"
        />
      </Animated.View>
    );
  };

  const getItemLayout = (_, index) => ({
    length: SNAP_INTERVAL,
    offset: SNAP_INTERVAL * index,
    index,
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.accentLine} />
        <Text style={styles.sectionTitle}>Sponsors 2026</Text>
        <View style={styles.accentLine} />
      </View>

      <FlatList
        ref={flatListRef}
        data={infinitePosters}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderPoster}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onScrollEndDrag={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / SNAP_INTERVAL));
        }}
      />

      {posterImages.length > 1 && (
        <View style={styles.dotsRow}>
          {posterImages.map((_, i) => {
            const realIndex = currentIndex % posterImages.length;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  realIndex === i && styles.dotActive,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  accentLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary + '60',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: (screenWidth - CARD_WIDTH) / 2 - CARD_MARGIN,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});

export default RandomImagesCarousel;