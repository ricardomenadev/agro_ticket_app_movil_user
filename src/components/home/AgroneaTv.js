import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ScrollView, Dimensions, Animated, Easing } from 'react-native';
import { Play, Youtube, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../styles/theme';


// Datos de muestra para videos - en una implementación real estos vendrían de una API
const youtubeVideos = [
  {
    id: 'video1',
    title: '#Agronea2025 #revolución',
    // thumbnail: require('../../../assets/images/videos/video1.jpg'),
    url: 'https://www.youtube.com/watch?v=example1',
    duration: '5:24',
  },
  {
    id: 'video2',
    title: 'Entrevista a John Deere',
    // thumbnail: require('../../../assets/images/videos/video2.jpg'),
    url: 'https://www.youtube.com/watch?v=example2',
    duration: '8:15',
  },
  {
    id: 'video3',
    title: 'Nuevas tecnologías agrícolas',
    // thumbnail: require('../../../assets/images/videos/video3.jpg'),
    url: 'https://www.youtube.com/watch?v=example3',
    duration: '3:40',
  },
  {
    id: 'video4',
    title: 'Resumen Agronea 2024',
    // thumbnail: require('../../../assets/images/videos/video4.jpg'),
    url: 'https://www.youtube.com/watch?v=example4',
    duration: '12:07',
  },
  {
    id: 'video5',
    title: 'Conferencia principal',
    // thumbnail: require('../../../assets/images/videos/video5.jpg'),
    url: 'https://www.youtube.com/watch?v=example5',
    duration: '15:32',
  },
];

const { width } = Dimensions.get('window');
const videoWidth = width * 0.7;
const videoMargin = 8;

const VideoCard = ({ video, index, scrollX }) => {
  // Calcular animación basada en la posición de scroll
  const inputRange = [
    (index - 1) * (videoWidth + videoMargin * 2),
    index * (videoWidth + videoMargin * 2),
    (index + 1) * (videoWidth + videoMargin * 2),
  ];
  
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });
  
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  // Abrir el video en YouTube
  const openVideo = () => {
    Linking.openURL(video.url);
  };

  return (
    <Animated.View
      style={[
        styles.videoCardContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity style={styles.videoCard} onPress={openVideo} activeOpacity={0.9}>
        <View style={styles.thumbnailContainer}>
          <Image source={video.thumbnail} style={styles.thumbnail} />
          <View style={styles.playIconContainer}>
            <Play size={24} color="white" fill="white" />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        </View>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
          <Text style={styles.channelName}>Agronea TV</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AgroneaTV = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(-20)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animación pulsante para el botón
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
          
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          
        }),
      ])
    ).start();
  }, []);
  
  // Abrir el canal de YouTube
  const openYouTubeChannel = () => {
    Linking.openURL('https://www.youtube.com/channel/CHANNEL_ID');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          }
        ]}
      >
        <View style={styles.titleContainer}>
          <Youtube size={24} color={COLORS.error} />
          <Text style={styles.title}>Agronea TV</Text>
        </View>
        <Text style={styles.subtitle}>Visitá nuestro canal de YOUTUBE</Text>
      </Animated.View>
      
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={videoWidth + videoMargin * 2}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {youtubeVideos.map((video, index) => (
          <VideoCard 
            key={video.id}
            video={video}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>
      
      <View style={styles.dotContainer}>
        {youtubeVideos.map((_, i) => {
          const inputRange = [
            (i - 1) * (videoWidth + videoMargin * 2),
            i * (videoWidth + videoMargin * 2),
            (i + 1) * (videoWidth + videoMargin * 2),
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: COLORS.primary,
                },
              ]}
            />
          );
        })}
      </View>
      
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          • Notas y videos sobre todas las novedades de AGRONEA.{'\n'}
          • Noticias y actualidad del sector agroindustrial.{'\n'}
          • Material, videos y capacitaciones de ediciones anteriores.
        </Text>
      </View>
      
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity 
          style={styles.visitButton} 
          onPress={openYouTubeChannel}
          activeOpacity={0.8}
        >
          <Text style={styles.visitButtonText}>VISITAR CANAL</Text>
          <ChevronRight size={18} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: videoMargin,
  },
  videoCardContainer: {
    width: videoWidth,
    marginHorizontal: videoMargin,
  },
  videoCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  channelName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  descriptionContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  visitButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  visitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default AgroneaTV;