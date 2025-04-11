import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const ExhibitorCard = ({ exhibitor }) => {
  const navigation = useNavigation();

  // Función para navegar al perfil del expositor
  const goToExhibitorProfile = () => {
    navigation.navigate('ExhibitorProfile', { exhibitorId: exhibitor.id });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={goToExhibitorProfile}
    >
      <View style={styles.innerContainer}>
        <Image 
          source={exhibitor.logo ? { uri: exhibitor.logo } : { uri: 'https://via.placeholder.com/150' }} 
          style={styles.logo} 
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.nameText}>{exhibitor.name}</Text>
            {exhibitor.highlighted && (
              <View style={styles.highlightBadge}>
                <Ionicons name="star" size={10} color="white" style={styles.highlightIcon} />
                <Text style={styles.highlightText}>Destacado</Text>
              </View>
            )}
          </View>
          <Text style={styles.descriptionText} numberOfLines={2}>{exhibitor.description}</Text>
          <View style={styles.footerRow}>
            <Text style={styles.standText}>Stand {exhibitor.stand}</Text>
            <TouchableOpacity style={styles.profileButton} onPress={goToExhibitorProfile}>
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
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  logo: {
    width: 64,
    height: 64, 
    borderRadius: 8,
    backgroundColor: '#2A2A2A', // Color de fondo mientras carga
  },
  contentContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  nameText: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 16,
  },
  highlightBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightIcon: {
    marginRight: 4,
  },
  highlightText: {
    color: 'white',
    fontSize: 12,
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  standText: {
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 143, 60, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  profileButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default ExhibitorCard;