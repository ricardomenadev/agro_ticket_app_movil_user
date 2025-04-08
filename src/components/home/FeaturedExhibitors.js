import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Animated } from 'react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';

const exhibitorLogos = [
  { id: '1', name: 'John Deere', logo: require('../../../assets/images/sponsors/deere.png') },
  { id: '2', name: 'Case IH', logo: require('../../../assets/images/sponsors/case.png') },
  { id: '3', name: 'Massey Ferguson', logo: require('../../../assets/images/sponsors/massey.png') },
  { id: '4', name: 'CLAAS', logo: require('../../../assets/images/sponsors/claas.png') },
  // Agrega aquí más expositores
];

const FeaturedExhibitors = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  
  // Animación de autodesplazamiento
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (flatListRef.current) {
        currentIndex = (currentIndex + 1) % exhibitorLogos.length;
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true
        });
      }
    }, 3000);
    
    return () => clearInterval(timer);
  }, []);

  const renderExhibitor = ({ item, index }) => {
    const inputRange = [
      (index - 1) * 200,
      index * 200,
      (index + 1) * 200
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp'
    });

    return (
      <TouchableOpacity style={styles.exhibitorItem}>
        <Animated.View style={[styles.exhibitorCard, { transform: [{ scale }], opacity }]}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expositores Destacados</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={exhibitorLogos}
        keyExtractor={item => item.id}
        renderItem={renderExhibitor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={200}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
  listContent: {
    paddingVertical: 10,
  },
  exhibitorItem: {
    width: 170,
    marginRight: 20,
  },
  exhibitorCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 150,
    justifyContent: 'center',
  },
  exhibitorLogo: {
    width: 100,
    height: 60,
    marginBottom: 15,
  },
  exhibitorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
});

export default FeaturedExhibitors;