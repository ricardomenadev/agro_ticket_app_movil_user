import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../../styles/theme';

// useRef evita que los Animated.Value se recreen en cada render
// En el componente original estaban declarados directo en el cuerpo del componente,
// lo que es un bug potencial con animaciones

const CountdownTimer = ({ targetDate, eventTitle, eventLocation, eventDates }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  // Guardamos los Animated.Value en un ref para que persistan entre renders
  const animatedValues = useRef({
    days: new Animated.Value(1),
    hours: new Animated.Value(1),
    minutes: new Animated.Value(1),
    seconds: new Animated.Value(1),
  }).current;

  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  // Animación de escala cuando cambia un dígito
  const animateChange = (key) => {
    Animated.sequence([
      Animated.timing(animatedValues[key], {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(animatedValues[key], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = calculateTimeLeft();
        // Animamos solo el dígito que cambió
        Object.keys(next).forEach(key => {
          if (next[key] !== prev[key]) animateChange(key);
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Block = ({ value, label, animKey }) => (
    <View style={styles.block}>
      <Animated.View
        style={[
          styles.digitBox,
          { transform: [{ scale: animatedValues[animKey] }] }
        ]}
      >
        {/* padStart asegura que el número siempre tenga 2 dígitos: 5 -> "05" */}
        <Text style={styles.digitText}>
          {String(value).padStart(2, '0')}
        </Text>
      </Animated.View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );

  const Separator = () => (
    <Text style={styles.separator}>:</Text>
  );

  return (
    <View style={styles.container}>
      {/* Título y ubicación */}
      <View style={styles.header}>
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        {eventDates && (
          <Text style={styles.eventDates}>{eventDates}</Text>
        )}
        <Text style={styles.eventLocation}>{eventLocation}</Text>
      </View>

      {/* Contador */}
      <View style={styles.row}>
        <Block value={timeLeft.days}    label="DÍAS"     animKey="days"    />
        <Separator />
        <Block value={timeLeft.hours}   label="HORAS"    animKey="hours"   />
        <Separator />
        <Block value={timeLeft.minutes} label="MIN"      animKey="minutes" />
        <Separator />
        <Block value={timeLeft.seconds} label="SEG"      animKey="seconds" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1,
  },
  eventDates: {
    fontSize: 15,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  eventLocation: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  block: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  digitBox: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    // Sombra — elevation es Android, shadow* es iOS
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  digitText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    fontVariant: ['tabular-nums'], // alinea los números para que no salten
  },
  labelText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  separator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    marginHorizontal: 2,
  },
});

export default CountdownTimer;