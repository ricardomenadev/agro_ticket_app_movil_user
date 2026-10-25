import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

// Imagen de fallback — misma que ExhibitorPoster
const FALLBACK_IMAGE = require('../../../assets/images/agronea2026publi.jpg');

const ExhibitorItem = ({ exhibitor, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {/* Thumbnail con bordes redondeados y fallback */}
      <Image
        source={exhibitor.poster ?? FALLBACK_IMAGE}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {exhibitor.name}
        </Text>

        {/* Stand — siempre visible, muestra "Por confirmar" si es null */}
        <View style={styles.standRow}>
          <Ionicons name="location-outline" size={13} color={COLORS.primary} />
          <Text style={styles.stand}>
            {exhibitor.stand ? `Stand ${exhibitor.stand}` : 'Stand por confirmar'}
          </Text>
        </View>

        {exhibitor.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {exhibitor.description}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingRight: 12,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 10,
    // Separación del borde izquierdo del card
    margin: 10,
  },
  info: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 8,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  standRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stand: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});

export default ExhibitorItem;