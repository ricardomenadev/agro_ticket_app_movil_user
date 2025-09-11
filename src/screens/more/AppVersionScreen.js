import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Linking,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const InfoCard = ({ icon, title, description, color = COLORS.primary }) => {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  );
};

const DeveloperCard = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.developerCard} onPress={onPress}>
      <View style={styles.developerHeader}>
        <View style={[styles.developerIcon, { backgroundColor: '#FFD70020' }]}>
          <Ionicons name="code-slash" size={32} color="#FFD700" />
        </View>
        <View style={styles.developerInfo}>
          <Text style={styles.developerName}>Wesyx Development</Text>
          <Text style={styles.developerTagline}>Desarrollado por profesionales</Text>
        </View>
      </View>
      
      <View style={styles.developerFeatures}>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Desarrollo móvil nativo</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Backend escalable</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.featureText}>Soporte 24/7</Text>
        </View>
      </View>

      <View style={styles.contactButtons}>
        <View style={styles.contactButton}>
          <Ionicons name="globe-outline" size={16} color="#FFD700" />
          <Text style={styles.contactButtonText}>wesyx.com</Text>
        </View>
        <View style={styles.contactButton}>
          <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
          <Text style={styles.contactButtonText}>Contacto</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AppVersionScreen = () => {
  const appVersion = "1.0.0";
  const buildNumber = "18";
  const releaseDate = "Agosto 2025";

  const handleDeveloperContact = () => {
    Alert.alert(
      "Contactar Desarrollador",
      "¿Cómo te gustaría contactar a Wesyx Development?",
      [
        {
          text: "WhatsApp",
          onPress: () => Linking.openURL('https://wa.me/+5493794739888')
        },
        {
          text: "Sitio Web",
          onPress: () => Linking.openURL('https://wesyx.com')
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const handleSupport = () => {
    Linking.openURL('https://wa.me/5493794222011?text=Hola, necesito soporte técnico para la app AGRONEA');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logoAgronea2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>AGRONEA PRODUCCIONES</Text>
          <Text style={styles.appTagline}>Conectando el campo argentino</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la App</Text>
          
          <InfoCard 
            icon="information-circle"
            title={`Versión ${appVersion}`}
            description={`Build ${buildNumber} - Lanzamiento ${releaseDate}`}
            color="#2196F3"
          />

          <InfoCard 
            icon="shield-checkmark"
            title="Estado de la App"
            description="Funcionando correctamente - Última actualización disponible"
            color="#4CAF50"
          />

          <InfoCard 
            icon="rocket"
            title="Nuevas Funcionalidades"
            description="Expositores, eventos, noticias y tienda oficial"
            color="#FF9800"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desarrollo Profesional</Text>
          <DeveloperCard onPress={handleDeveloperContact} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Necesitas una App para tu Empresa?</Text>
          
          <View style={styles.promotionCard}>
            <View style={styles.promotionHeader}>
              <Ionicons name="trending-up" size={28} color="#FFD700" />
              <Text style={styles.promotionTitle}>Wesyx Development</Text>
            </View>
            
            <Text style={styles.promotionDescription}>
              Creamos aplicaciones móviles profesionales para empresas que buscan 
              crecer y conectar mejor con sus clientes.
            </Text>

            <View style={styles.promotionFeatures}>
              <View style={styles.promotionFeature}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.primary} />
                <Text style={styles.promotionFeatureText}>Apps iOS & Android</Text>
              </View>
              <View style={styles.promotionFeature}>
                <Ionicons name="globe" size={20} color={COLORS.primary} />
                <Text style={styles.promotionFeatureText}>Sitios Web</Text>
              </View>
              <View style={styles.promotionFeature}>
                <Ionicons name="server" size={20} color={COLORS.primary} />
                <Text style={styles.promotionFeatureText}>Sistemas Backend</Text>
              </View>
              <View style={styles.promotionFeature}>
                <Ionicons name="storefront" size={20} color={COLORS.primary} />
                <Text style={styles.promotionFeatureText}>E-commerce</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.promotionButton}
              onPress={() => Linking.openURL('https://wa.me/+5493794739888?text=Hola, me interesa desarrollar una app para mi empresa')}
            >
              <Ionicons name="logo-whatsapp" size={20} color="white" />
              <Text style={styles.promotionButtonText}>Consultar Presupuesto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte Técnico</Text>
          
          <TouchableOpacity style={styles.supportItem} onPress={handleSupport}>
            <Ionicons name="headset" size={24} color="#25D366" />
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>¿Problemas con la app?</Text>
              <Text style={styles.supportDescription}>
                Contáctanos por WhatsApp para soporte técnico inmediato
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 AGRONEA PRODUCCIONES S.R.L
          </Text>
          <Text style={styles.footerSubtext}>
            Sistema desarrollado y administrado por Wesyx.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  developerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  developerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  developerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  developerTagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  developerFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  contactButtonText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  promotionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD70030',
  },
  promotionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promotionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 12,
  },
  promotionDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  promotionFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  promotionFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  promotionFeatureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  promotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  promotionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  supportContent: {
    flex: 1,
    marginLeft: 16,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default AppVersionScreen;