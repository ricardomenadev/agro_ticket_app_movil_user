import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Animated, SafeAreaView } from 'react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../styles/theme';

// Importamos los componentes que hemos creado
import HomeHeader from '../components/home/HomeHeader';
import CountdownTimer from '../components/home/CountdownTimer';
import FeaturedExhibitors from '../components/home/FeaturedExhibitors';
import FeaturedProducts from '../components/shop/FeaturedProducts';
import UpcomingEvents from '../components/home/UpcomingEvents';
import NewsSection from '../components/home/NewsSection';

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [250, 130],
    extrapolate: 'clamp'
  });
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <HomeHeader />
      </Animated.View>
      
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <CountdownTimer 
          targetDate="2025-07-04T00:00:00"
          eventTitle="AGRONEA 2025"
          eventLocation="Charata, Chaco"
        />
        
        <FeaturedExhibitors />
        
        <UpcomingEvents />
        
        <FeaturedProducts />
        
        <NewsSection />
        
        <View style={{ height: 80 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 20,
  },
});

export default HomeScreen;