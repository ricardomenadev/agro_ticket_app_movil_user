// src/styles/theme.js
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: "#0A8F3C",     // Verde AGRONEA
  secondary: "#FFD700",   // Dorado
  background: "#121212",  // Fondo negro/oscuro
  card: "#1E1E1E",        // Negro más claro para tarjetas
  border: "#2A2A2A",      // Bordes sutiles
  text: "#FFFFFF",        // Texto blanco
  textSecondary: "#AAAAAA", // Texto secundario
  success: "#4CAF50",     // Verde para éxito
  warning: "#FFC107",     // Amarillo para advertencias
  error: "#F44336",       // Rojo para errores
  info: "#2196F3"         // Azul para información
};

// Definición de tamaños
export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  
  // Espaciado
  padding: 16,
  margin: 16,
  
  // Radios de borde
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  
  // Tamaños de contenedores
  buttonHeight: 50,
  inputHeight: 50,
  cardWidth: '90%',
};

// Definición de fuentes
export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
};

// Estilos comunes reutilizables
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    ...StyleSheet.flatten({
      shadowColor: COLORS.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.xlarge,
    color: COLORS.text,
    marginBottom: SIZES.margin,
  },
  subtitle: {
    ...FONTS.medium,
    fontSize: SIZES.large,
    color: COLORS.text,
    marginBottom: SIZES.margin / 2,
  },
  bodyText: {
    ...FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.text,
  },
  smallText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMedium,
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  buttonText: {
    ...FONTS.medium,
    fontSize: SIZES.font,
    color: COLORS.background,
  },
  input: {
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.padding,
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.text,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
});