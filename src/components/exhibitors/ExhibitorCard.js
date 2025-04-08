import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const ExhibitorCard = ({ exhibitor }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
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
                <Text style={styles.highlightText}>Destacado</Text>
              </View>
            )}
          </View>
          <Text style={styles.descriptionText}>{exhibitor.description}</Text>
          <View style={styles.footerRow}>
            <Text style={styles.standText}>Stand {exhibitor.stand}</Text>
            <TouchableOpacity style={styles.profileButton}>
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
    backgroundColor: 'white',
    borderRadius: 8,
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
    backgroundColor: '#F3F4F6', // Color de fondo mientras carga
  },
  contentContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: 'bold',
    color: '#222222',
    fontSize: 16,
  },
  highlightBadge: {
    backgroundColor: COLORS.secondary, // Utilizando el amarillo/dorado de tu paleta
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  highlightText: {
    color: 'white',
    fontSize: 12,
  },
  descriptionText: {
    color: '#888888',
    fontSize: 14,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  standText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default ExhibitorCard;