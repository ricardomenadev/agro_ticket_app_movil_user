// src/components/exhibitors/profile/AboutSection.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import {
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Award,
} from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';

const AboutSection = ({ exhibitor }) => {
  // Funciones para abrir enlaces
  const openPhone = (phone) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const openEmail = (email) => {
    if (email) Linking.openURL(`mailto:${email}`);
  };

  const openWebsite = (website) => {
    if (website) {
      const url = website.startsWith('http') ? website : `https://${website}`;
      Linking.openURL(url);
    }
  };

  const openWhatsApp = (whatsapp) => {
    if (whatsapp) Linking.openURL(`https://wa.me/${whatsapp}`);
  };

  const openSocialMedia = (url) => {
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Stats básicos */}
      <View style={styles.aboutRow}>
        {/* <View style={styles.aboutItem}>
          <Award size={18} color={COLORS.secondary} />
          <Text style={styles.aboutItemTitle}>Desde</Text>
          <Text style={styles.aboutItemValue}>{exhibitor?.since || '2024'}</Text>
        </View> */}
        <View style={styles.aboutItem}>
          <MapPin size={18} color={COLORS.secondary} />
          <Text style={styles.aboutItemTitle}>Stand</Text>
          <Text style={styles.aboutItemValue}>{exhibitor?.stand || 'Por confirmar'}</Text>
        </View>
      </View>
      
      {/* Descripción */}
      <Text style={styles.sectionTitle}>Acerca de</Text>
      <Text style={styles.descriptionText}>
        {exhibitor?.description || 'Empresa participante en AGRONEA 2025'}
      </Text>
      
      {/* Contacto */}
      <Text style={styles.sectionTitle}>Contacto</Text>
      <View style={styles.contactContainer}>
        {exhibitor?.contact?.phone && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openPhone(exhibitor.contact.phone)}
          >
            <Phone size={18} color={COLORS.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>{exhibitor.contact.phone}</Text>
          </TouchableOpacity>
        )}
        
        {exhibitor?.contact?.email && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openEmail(exhibitor.contact.email)}
          >
            <Mail size={18} color={COLORS.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>{exhibitor.contact.email}</Text>
          </TouchableOpacity>
        )}
        
        {exhibitor?.website && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openWebsite(exhibitor.website)}
          >
            <LinkIcon size={18} color={COLORS.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>{exhibitor.website}</Text>
          </TouchableOpacity>
        )}

        {exhibitor?.contact?.whatsapp && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => openWhatsApp(exhibitor.contact.whatsapp)}
          >
            <Ionicons name="logo-whatsapp" size={18} color={COLORS.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>
        )}
        
        {exhibitor?.contact?.address && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL(`https://maps.google.com/?q=${exhibitor.contact.address}`)}
          >
            <MapPin size={18} color={COLORS.primary} style={styles.contactIcon} />
            <Text style={styles.contactText}>{exhibitor.contact.address}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Redes sociales */}
      {(exhibitor?.socialMedia?.facebook || 
        exhibitor?.socialMedia?.instagram || 
        exhibitor?.socialMedia?.twitter || 
        exhibitor?.socialMedia?.youtube) && (
        <View style={styles.socialContainer}>
          {exhibitor.socialMedia.facebook && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
              onPress={() => openSocialMedia(exhibitor.socialMedia.facebook)}
            >
              <Ionicons name="logo-facebook" size={18} color="white" />
            </TouchableOpacity>
          )}
          
          {exhibitor.socialMedia.instagram && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#C13584' }]}
              onPress={() => openSocialMedia(exhibitor.socialMedia.instagram)}
            >
              <Ionicons name="logo-instagram" size={18} color="white" />
            </TouchableOpacity>
          )}
          
          {exhibitor.socialMedia.twitter && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
              onPress={() => openSocialMedia(exhibitor.socialMedia.twitter)}
            >
              <Ionicons name="logo-twitter" size={18} color="white" />
            </TouchableOpacity>
          )}
          
          {exhibitor.socialMedia.youtube && (
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: '#FF0000' }]}
              onPress={() => openSocialMedia(exhibitor.socialMedia.youtube)}
            >
              <Ionicons name="logo-youtube" size={18} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  aboutRow: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    marginHorizontal: 12,
  },
  aboutItemTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  aboutItemValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  contactContainer: {
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default AboutSection;