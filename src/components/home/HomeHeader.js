import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, StatusBar, SafeAreaView, Animated } from 'react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const logoScale = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.85, 1.05, 1]
    });

    const titleTranslateY = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0]
    });

    const titleOpacity = this.state.animation.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 0, 1]
    });

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.headerTop}>
            <Animated.Image
              source={require('../../../assets/images/logos/agronea-logo.jpg')}
              style={[styles.logo, { transform: [{ scale: logoScale }] }]}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Animated.View 
            style={[
              styles.titleContainer, 
              { 
                opacity: titleOpacity, 
                transform: [{ translateY: titleTranslateY }] 
              }
            ]}
          >
            <Text style={styles.title}>AGRONEA 2025</Text>
            <Text style={styles.subtitle}>La exposición agrícola más importante</Text>
          </Animated.View>
          
          <View style={styles.sponsorsContainer}>
            <Text style={styles.sponsorsTitle}>Patrocinadores Premium</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.sponsorsScroll}
            >
              {/* Logos de los patrocinadores */}
              <Image source={require('../../../assets/images/sponsors/deere.png')} style={styles.sponsorLogo} />
              <Image source={require('../../../assets/images/sponsors/case.png')} style={styles.sponsorLogo} />
              <Image source={require('../../../assets/images/sponsors/massey.png')} style={styles.sponsorLogo} />
              <Image source={require('../../../assets/images/sponsors/claas.png')} style={styles.sponsorLogo} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.background,
  },
  container: {
    backgroundColor: COLORS.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 50,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sponsorsContainer: {
    marginTop: 10,
  },
  sponsorsTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  sponsorsScroll: {
    flexDirection: 'row',
  },
  sponsorLogo: {
    width: 70,
    height: 30,
    marginRight: 15,
    resizeMode: 'contain',
  },
});

export default HomeHeader;