import React, { useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Animated, SafeAreaView } from 'react-native';
import { COLORS } from '../styles/theme';

// Importamos los componentes
import HomeHeader from '../components/home/HomeHeader';
import CountdownTimer from '../components/home/CountdownTimer';
import FeaturedExhibitors from '../components/home/FeaturedExhibitors';
import FeaturedProducts from '../components/shop/FeaturedProducts';
import UpcomingEvents from '../components/home/UpcomingEvents';
import NewsSection from '../components/home/NewsSection';
import TicketsPromo from '../components/home/TicketsPromo';
import LocationMap from '../components/home/LocationMap';
import AgroneaTV from '../components/home/AgroneaTv';
import HomeFooter from '../components/home/HomeFooter';

const HomeScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerHeight = 60;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      
      <View style={[styles.header, { height: headerHeight }]}>
        <HomeHeader />
      </View>
      
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
        
        {/* Componente para compra de entradas */}
        <TicketsPromo />

        <FeaturedProducts />
        
        
        
        <FeaturedExhibitors />
        
        <UpcomingEvents />

        <NewsSection />
        
        {/* Componente para Agronea TV */}
        <AgroneaTV />
        
               
        {/* Componente para mapa y ubicación */}
        <LocationMap />
        
        {/* Footer con información de contacto */}
        <HomeFooter />
        
        {/* Espacio adicional al final del scroll */}
        <View style={{ height: 40 }} />
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
    paddingBottom: 0, // Eliminado padding porque el footer ya tiene su propio padding
  },
});

export default HomeScreen;