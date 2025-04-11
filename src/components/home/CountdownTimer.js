import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, SIZES, FONTS, commonStyles } from '../../styles/theme';

const CountdownTimer = ({ targetDate, eventTitle, eventLocation }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const animatedValues = {
    days: new Animated.Value(0),
    hours: new Animated.Value(0),
    minutes: new Animated.Value(0),
    seconds: new Animated.Value(0)
  };
  
  // Función para calcular tiempo restante
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return newTimeLeft;
  };
  
  // Animar cambios en el contador
  const animateValue = (key, toValue) => {
    Animated.timing(animatedValues[key], {
      toValue,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.elastic(1)
    }).start();
  };
  
  useEffect(() => {
    // Inicializar valores
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    
    // Configurar intervalo para actualizar el contador
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      
      // Animar cambios
      Object.keys(newTimeLeft).forEach(key => {
        // Usamos una función para comparar con el estado anterior
        setTimeLeft(prevTimeLeft => {
          if (newTimeLeft[key] !== prevTimeLeft[key]) {
            animateValue(key, newTimeLeft[key]);
          }
          return newTimeLeft;
        });
      });
      
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  // Crear animaciones de rotación para cada dígito
  const createRotateAnimation = (value) => {
    return value.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        <Text style={styles.eventLocation}>{eventLocation}</Text>
      </View>
      
      <View style={styles.countdownContainer}>
        <View style={styles.counterRow}>
          <View style={styles.counterItem}>
            <Animated.View
              style={[
                styles.counterDigit,
                {
                  transform: [
                    { rotateX: createRotateAnimation(animatedValues.days) }
                  ]
                }
              ]}
            >
              <Text style={styles.counterNumber}>{timeLeft.days}</Text>
            </Animated.View>
            <Text style={styles.counterLabel}>DÍAS</Text>
          </View>
          
          <View style={styles.counterItem}>
            <Animated.View
              style={[
                styles.counterDigit,
                {
                  transform: [
                    { rotateX: createRotateAnimation(animatedValues.hours) }
                  ]
                }
              ]}
            >
              <Text style={styles.counterNumber}>{timeLeft.hours}</Text>
            </Animated.View>
            <Text style={styles.counterLabel}>HORAS</Text>
          </View>
          
          <View style={styles.counterItem}>
            <Animated.View
              style={[
                styles.counterDigit,
                {
                  transform: [
                    { rotateX: createRotateAnimation(animatedValues.minutes) }
                  ]
                }
              ]}
            >
              <Text style={styles.counterNumber}>{timeLeft.minutes}</Text>
            </Animated.View>
            <Text style={styles.counterLabel}>MINUTOS</Text>
          </View>
          
          <View style={styles.counterItem}>
            <Animated.View
              style={[
                styles.counterDigit,
                {
                  transform: [
                    { rotateX: createRotateAnimation(animatedValues.seconds) }
                  ]
                }
              ]}
            >
              <Text style={styles.counterNumber}>{timeLeft.seconds}</Text>
            </Animated.View>
            <Text style={styles.counterLabel}>SEGUNDOS</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: COLORS.card,
    // borderRadius: 10,
     padding: 16,
    // marginHorizontal: 16,
    // marginTop: -20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
    // elevation: 5,
    // borderWidth: 1,
    // borderColor: COLORS.border,
  },
  eventInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  countdownContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  counterItem: {
    alignItems: 'center',
  },
  counterDigit: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    backfaceVisibility: 'hidden',
  },
  counterNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  counterLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default CountdownTimer;