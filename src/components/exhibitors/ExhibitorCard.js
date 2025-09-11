import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronRight, MapPin, Package, Newspaper, Calendar } from 'lucide-react-native';
import { COLORS } from '../../styles/theme';

const ExhibitorCard = ({ exhibitor, onPress }) => {
  
  // Función para navegar al perfil del expositor
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Tu URL de ngrok para desarrollo
  const baseBackendUrl = __DEV__ 
    ? 'https://19b278b633aa.ngrok-free.app'  // Cambia solo esta línea cuando cambies ngrok
    : 'https://api.agronea.store';
  
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  if (imagePath.startsWith("/uploads")) {
    return `${baseBackendUrl}${imagePath}`;
  }
  
  return imagePath;
};

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.innerContainer}>
        {/* Logo del expositor */}
        <View style={styles.logoContainer}>
          {exhibitor.logo ? (
            <Image
              source={{ uri: getImageUrl(exhibitor.logo) }}
              style={styles.logo}
              defaultSource={require('../../../assets/images/placeholder.png')}
            />
          ) : (
            <View style={[styles.logo, styles.logoPlaceholder]}>
              <Text style={styles.logoText}>
                {exhibitor.name?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
        </View>

        {/* Contenido */}
        <View style={styles.contentContainer}>
          {/* Header con nombre */}
          <View style={styles.headerRow}>
            <Text style={styles.nameText} numberOfLines={2}>
              {exhibitor.name || 'Sin nombre'}
            </Text>
          </View>

          {/* Descripción */}
          <Text style={styles.descriptionText} numberOfLines={2}>
            {exhibitor.description || 'Empresa participante en AGRONEA 2025'}
          </Text>

          {/* Estadísticas */}
          {exhibitor.stats && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Package size={12} color={COLORS.primary} />
                <Text style={styles.statText}>{exhibitor.stats.products || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Newspaper size={12} color={COLORS.primary} />
                <Text style={styles.statText}>{exhibitor.stats.news || 0}</Text>
              </View>
              <View style={styles.statItem}>
                <Calendar size={12} color={COLORS.primary} />
                <Text style={styles.statText}>{exhibitor.stats.events || 0}</Text>
              </View>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footerRow}>
            <View style={styles.standContainer}>
              <MapPin size={14} color={COLORS.secondary} />
              <Text style={styles.standText}>
                Stand {exhibitor.stand || 'Por confirmar'}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.profileButton} onPress={handlePress}>
              <Text style={styles.profileButtonText}>Ver perfil</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  innerContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    marginBottom: 8,
  },
  nameText: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  standContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  standText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 4,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  profileButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
    fontWeight: '600',
  },
});

export default ExhibitorCard;