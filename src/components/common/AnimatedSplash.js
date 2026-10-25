// Arranque animado: el logo entra con un zoom suave, se dibuja la línea dorada y la pantalla se desvanece.
// Reemplaza al video de 2026 que arrancaba solo.
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LOGO_W = Dimensions.get("window").width * 0.72;

const AnimatedSplash = ({ onDone }) => {
  const logo = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.timing(logo, { toValue: 1, duration: 700, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(line, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(tagline, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
      ]),
      Animated.delay(600),
      Animated.timing(fade, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]);
    anim.start(() => onDone());
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade, zIndex: 100, elevation: 100 }]} pointerEvents="none">
      <LinearGradient colors={["#14a84a", "#0b5e2c", "#06100a"]} locations={[0, 0.45, 1]} style={styles.bg}>
        <Animated.Image
          source={require("../../../assets/images/logo_splash_blanco.png")}
          resizeMode="contain"
          accessibilityLabel="Agronea Producciones"
          style={[
            styles.logo,
            {
              opacity: logo,
              transform: [{ scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
            },
          ]}
        />
        <Animated.View style={[styles.line, { transform: [{ scaleX: line }] }]} />
        <Animated.View
          style={{ opacity: tagline, transform: [{ translateY: tagline.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}
        >
          <Text style={styles.tagline}>Precios, noticias y todo Agronea{"\n"}en un solo lugar</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, alignItems: "center", justifyContent: "center", gap: 22 },
  logo: { width: LOGO_W, height: (LOGO_W * 415) / 900 },
  line: { width: 180, height: 4, borderRadius: 2, backgroundColor: "#F5C400" },
  tagline: { color: "#cfe6d6", fontSize: 14, textAlign: "center", lineHeight: 20 },
});

export default AnimatedSplash;
