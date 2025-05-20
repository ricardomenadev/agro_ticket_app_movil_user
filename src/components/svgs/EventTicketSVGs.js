import React from 'react';
import Svg, { Path, Rect, Circle, Text, G, LinearGradient, Stop, Defs, Pattern, ClipPath } from 'react-native-svg';

// Entrada General
export const GeneralTicketSVG = ({ width = 300, height = 150 }) => (
  <Svg width={width} height={height} viewBox="0 0 300 150">
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#1a6ab1" stopOpacity="1" />
        <Stop offset="1" stopColor="#4a90e2" stopOpacity="1" />
      </LinearGradient>
      <Pattern id="pattern" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <Rect width="10" height="10" fill="#FFF" fillOpacity="0.1" />
      </Pattern>
    </Defs>
    
    <Rect width="300" height="150" fill="url(#grad)" />
    <Rect width="300" height="150" fill="url(#pattern)" />
    
    <G>
      <Path 
        d="M 0,30 H 300 M 0,120 H 300" 
        stroke="#FFF" 
        strokeWidth="2" 
        strokeDasharray="5,5" 
        strokeOpacity="0.5" 
      />
      
      <Circle cx="20" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="20" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
    </G>
    
    <G>
      <Text
        x="150"
        y="35"
        fontSize="16"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        AGRONEA 2025
      </Text>
      
      <Text
        x="150"
        y="60"
        fontSize="20"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        ENTRADA GENERAL
      </Text>
      
      <Text
        x="150"
        y="85"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        15-17 JULIO 2025
      </Text>
      
      <Text
        x="150"
        y="105"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        PREDIO FERIAL SAN VICENTE
      </Text>
    </G>
    
    <Rect x="210" y="75" width="70" height="30" fill="#FFF" fillOpacity="0.2" rx="5" />
    <Text
      x="245"
      y="95"
      fontSize="14"
      fontWeight="bold"
      fill="#FFF"
      textAnchor="middle"
    >
      $3.500
    </Text>
  </Svg>
);

// Entrada VIP
export const VIPTicketSVG = ({ width = 300, height = 150 }) => (
  <Svg width={width} height={height} viewBox="0 0 300 150">
    <Defs>
      <LinearGradient id="gradVIP" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#b8860b" stopOpacity="1" />
        <Stop offset="1" stopColor="#ffd700" stopOpacity="1" />
      </LinearGradient>
      <Pattern id="patternVIP" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <Rect width="10" height="10" fill="#FFF" fillOpacity="0.1" />
      </Pattern>
    </Defs>
    
    <Rect width="300" height="150" fill="url(#gradVIP)" />
    <Rect width="300" height="150" fill="url(#patternVIP)" />
    
    <G>
      <Path 
        d="M 0,30 H 300 M 0,120 H 300" 
        stroke="#FFF" 
        strokeWidth="2" 
        strokeDasharray="5,5" 
        strokeOpacity="0.5" 
      />
      
      <Circle cx="20" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="20" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
    </G>
    
    <Circle cx="50" cy="75" r="30" fill="#FFF" fillOpacity="0.2" />
    <Text
      x="50"
      y="80"
      fontSize="18"
      fontWeight="bold"
      fill="#FFF"
      textAnchor="middle"
    >
      VIP
    </Text>
    
    <G>
      <Text
        x="150"
        y="35"
        fontSize="16"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        AGRONEA 2025
      </Text>
      
      <Text
        x="150"
        y="60"
        fontSize="20"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        ACCESO VIP
      </Text>
      
      <Text
        x="150"
        y="85"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        15-17 JULIO 2025
      </Text>
      
      <Text
        x="150"
        y="105"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        INCLUYE KIT + ZONA PREFERENCIAL
      </Text>
    </G>
    
    <Rect x="210" y="75" width="70" height="30" fill="#FFF" fillOpacity="0.2" rx="5" />
    <Text
      x="245"
      y="95"
      fontSize="14"
      fontWeight="bold"
      fill="#FFF"
      textAnchor="middle"
    >
      $6.500
    </Text>
  </Svg>
);

// Estacionamiento
export const ParkingTicketSVG = ({ width = 300, height = 150 }) => (
  <Svg width={width} height={height} viewBox="0 0 300 150">
    <Defs>
      <LinearGradient id="gradParking" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#2e8b57" stopOpacity="1" />
        <Stop offset="1" stopColor="#3cb371" stopOpacity="1" />
      </LinearGradient>
      <Pattern id="patternParking" width="15" height="15" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <Rect width="10" height="10" fill="#FFF" fillOpacity="0.1" />
      </Pattern>
    </Defs>
    
    <Rect width="300" height="150" fill="url(#gradParking)" />
    <Rect width="300" height="150" fill="url(#patternParking)" />
    
    <G>
      <Path 
        d="M 0,30 H 300 M 0,120 H 300" 
        stroke="#FFF" 
        strokeWidth="2" 
        strokeDasharray="5,5" 
        strokeOpacity="0.5" 
      />
      
      <Circle cx="20" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="30" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="20" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
      <Circle cx="280" cy="120" r="8" fill="#FFF" fillOpacity="0.6" />
    </G>
    
    <Circle cx="50" cy="75" r="30" fill="#FFF" fillOpacity="0.2" />
    <Text
      x="50"
      y="80"
      fontSize="22"
      fontWeight="bold"
      fill="#FFF"
      textAnchor="middle"
    >
      P
    </Text>
    
    <G>
      <Text
        x="150"
        y="35"
        fontSize="16"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        AGRONEA 2025
      </Text>
      
      <Text
        x="150"
        y="60"
        fontSize="18"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        ESTACIONAMIENTO
      </Text>
      
      <Text
        x="150"
        y="85"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        15-17 JULIO 2025
      </Text>
      
      <Text
        x="150"
        y="105"
        fontSize="12"
        fill="#FFF"
        textAnchor="middle"
      >
        ACCESO VEHICULAR ZONA A
      </Text>
    </G>
    
    <Rect x="210" y="75" width="70" height="30" fill="#FFF" fillOpacity="0.2" rx="5" />
    <Text
      x="245"
      y="95"
      fontSize="14"
      fontWeight="bold"
      fill="#FFF"
      textAnchor="middle"
    >
      $2.000
    </Text>
  </Svg>
);

