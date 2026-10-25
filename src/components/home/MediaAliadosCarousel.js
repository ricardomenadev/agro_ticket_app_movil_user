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
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

// Para agregar un medio aliado nuevo:
//   1. Copiar la imagen a assets/images/medios/
//   2. Agregar una línea acá
const mediosImages = [
  { id: 'fm_sideral',     source: require('../../../assets/images/medios/fm_sideral.png') },
  { id: 'infocampo',      source: require('../../../assets/images/medios/infocampo.png') },
  { id: 'red_television', source: require('../../../assets/images/medios/red_television.png') },
  { id: 'nueva_era',      source: require('../../../assets/images/medios/nueva_era.png') },
  { id: 'agrositio',      source: require('../../../assets/images/medios/agrositio.png') },
  { id: 'agroempresario', source: require('../../../assets/images/medios/agroempresario.png') },
];

// Mismas proporciones que RandomImagesCarousel
const CARD_WIDTH = screenWidth * 0.62;
const CARD_HEIGHT = CARD_WIDTH * 1.25;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

const MediaAliadosCarousel = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const randomStart = useMemo(
    () => mediosImages.length + Math.floor(Math.random() * mediosImages.length),
    [],
  );

  const infiniteMedios = useMemo(
    () => [...mediosImages, ...mediosImages, ...mediosImages],
    [],
  );

  const START_INDEX = mediosImages.length;

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current && mediosImages.length > 1) {
        flatListRef.current.scrollToIndex({ index: randomStart, animated: false });
      }
    }, 100);
    setCurrentIndex(randomStart);

    if (mediosImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;

        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: next, animated: true });
        }

        if (next >= infiniteMedios.length - mediosImages.length) {
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

  const renderMedio = ({ item, index }) => {
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
      <Animated.View style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}>
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
        <View style={styles.titleRow}>
          <Ionicons name="megaphone-outline" size={15} color={COLORS.text} />
          <Text style={styles.sectionTitle}>Medios Aliados</Text>
        </View>
        <View style={styles.accentLine} />
      </View>

      <FlatList
        ref={flatListRef}
        data={infiniteMedios}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderMedio}
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

      {mediosImages.length > 1 && (
        <View style={styles.dotsRow}>
          {mediosImages.map((_, i) => {
            const realIndex = currentIndex % mediosImages.length;
            return (
              <View
                key={i}
                style={[styles.dot, realIndex === i && styles.dotActive]}
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
  // titleRow agrupa el ícono y el texto para que el sectionHeader
  // los trate como un único elemento entre las dos líneas
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
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

export default MediaAliadosCarousel;