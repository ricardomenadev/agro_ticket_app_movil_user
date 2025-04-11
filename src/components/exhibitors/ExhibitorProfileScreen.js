import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';
import {
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Award,
  Users,
  Bookmark,
  Share2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

// Tamaño de la pantalla para cálculos
const { width } = Dimensions.get('window');

// Datos de ejemplo para John Deere (normalmente vendrían de las props o un servicio)
const johnDeere = {
  id: 'johndeere',
  name: 'John Deere',
  logo: require('../../../assets/images/expositor/johndeere.png'),
  coverPhoto: require('../../../assets/images/expositor/johndeere-cover.jpg'),
  description: 'Con más de 180 años de experiencia, John Deere es líder mundial en el suministro de productos, tecnologías y servicios avanzados para la agricultura. Nuestra misión es mejorar la calidad de vida de las personas a través de la innovación en equipos agrícolas.',
  stand: 'A-12',
  sector: 'Maquinaria Agrícola',
  highlighted: true,
  verified: true,
  since: 1837,
  website: 'www.deere.com',
  email: 'info@johndeere.com',
  phone: '+54 11 4555-1234',
  address: 'Av. del Libertador 498, Buenos Aires',
  products: [
    {
      id: 1,
      name: 'Tractor Serie 6M',
      image: require('../../../assets/images/expositor/tractor-m6.jpg'),
      price: 'Consultar',
      description: 'El compañero ideal para tareas exigentes con eficiencia de combustible mejorada.'
    },
    {
      id: 2,
      name: 'Cosechadora S790',
      image: require('../../../assets/images/expositor/cosechadora.jpg'),
      price: 'Consultar',
      description: 'Maximice su productividad y eficiencia con nuestra cosechadora insignia.'
    },
    {
      id: 3,
      name: 'Pulverizadora M4000',
      image: require('../../../assets/images/expositor/pulverizadora.jpg'),
      price: 'Consultar',
      description: 'La precisión y potencia que su cultivo necesita en una pulverizadora de última generación.'
    }
  ],
  news: [
    {
      id: 1,
      title: 'Nueva tecnología de agricultura de precisión',
      date: '20/03/2025',
      image: require('../../../assets/images/expositor/precision-tech.jpeg'),
      summary: 'Lanzamos nuestro sistema de agricultura de precisión con mapeo en tiempo real y ajuste automático para maximizar el rendimiento de sus cultivos.'
    },
    {
      id: 2,
      title: 'Financiación especial para AGRONEA 2025',
      date: '15/03/2025',
      image: require('../../../assets/images/expositor/financiacion.jpg'),
      summary: 'Aprovecha nuestras condiciones especiales de financiación disponibles exclusivamente durante AGRONEA 2025.'
    }
  ],
  events: [
    {
      id: 1,
      title: 'Demostración en vivo de tractores Serie 6M',
      date: '4 de Julio',
      time: '14:30',
      location: 'Campo Experimental'
    },
    {
      id: 2,
      title: 'Charla: El futuro de la Agricultura 4.0',
      date: '5 de Julio',
      time: '11:00',
      location: 'Stand A-12'
    },
    {
      id: 3,
      title: 'Workshop: Optimización de flotas agrícolas',
      date: '6 de Julio',
      time: '10:30',
      location: 'Sala de Conferencias B'
    }
  ],
  gallery: [
    require('../../../assets/images/expositor/gallery1.jpg'),
    require('../../../assets/images/expositor/gallery2.jpg'),
    require('../../../assets/images/expositor/gallery3.jpg'),
    require('../../../assets/images/expositor/gallery4.jpg'),
    require('../../../assets/images/expositor/gallery5.jpg')
  ],
  achievements: [
    'Líder mundial en maquinaria agrícola',
    'Más de 60.000 empleados en todo el mundo',
    'Presente en más de 160 países',
    'Premio a la Innovación Agrícola 2024'
  ],
  socialMedia: {
    facebook: 'https://facebook.com/johndeere',
    instagram: 'https://instagram.com/johndeere',
    twitter: 'https://twitter.com/johndeere',
    youtube: 'https://youtube.com/johndeere'
  }
};

// Componente principal
const ExhibitorProfileScreen = ({ route, navigation }) => {
  // En una implementación real, obtendrías el ID del expositor a través de la ruta
  // const { exhibitorId } = route.params;
  // const exhibitor = getExhibitorById(exhibitorId);
  
  // Por ahora, usaremos John Deere como ejemplo
  const exhibitor = johnDeere;
  
  // Estados para las secciones expandibles
  const [activeSection, setActiveSection] = useState('about');
  
  // Renderizado de cada sección
  const renderAboutSection = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.aboutRow}>
        <View style={styles.aboutItem}>
          <Award size={18} color={COLORS.secondary} />
          <Text style={styles.aboutItemTitle}>Desde</Text>
          <Text style={styles.aboutItemValue}>{exhibitor.since}</Text>
        </View>
        <View style={styles.aboutItem}>
          <MapPin size={18} color={COLORS.secondary} />
          <Text style={styles.aboutItemTitle}>Stand</Text>
          <Text style={styles.aboutItemValue}>{exhibitor.stand}</Text>
        </View>
        <View style={styles.aboutItem}>
          <Users size={18} color={COLORS.secondary} />
          <Text style={styles.aboutItemTitle}>Sector</Text>
          <Text style={styles.aboutItemValue}>{exhibitor.sector}</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Acerca de</Text>
      <Text style={styles.descriptionText}>{exhibitor.description}</Text>
      
      <Text style={styles.sectionTitle}>Logros</Text>
      <View style={styles.achievementsContainer}>
        {exhibitor.achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <Star size={16} color={COLORS.secondary} style={styles.achievementIcon} />
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Contacto</Text>
      <View style={styles.contactContainer}>
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`tel:${exhibitor.phone}`)}
        >
          <Phone size={18} color={COLORS.primary} style={styles.contactIcon} />
          <Text style={styles.contactText}>{exhibitor.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`mailto:${exhibitor.email}`)}
        >
          <Mail size={18} color={COLORS.primary} style={styles.contactIcon} />
          <Text style={styles.contactText}>{exhibitor.email}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`https://${exhibitor.website}`)}
        >
          <LinkIcon size={18} color={COLORS.primary} style={styles.contactIcon} />
          <Text style={styles.contactText}>{exhibitor.website}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`https://maps.google.com/?q=${exhibitor.address}`)}
        >
          <MapPin size={18} color={COLORS.primary} style={styles.contactIcon} />
          <Text style={styles.contactText}>{exhibitor.address}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: '#3b5998' }]}
          onPress={() => Linking.openURL(exhibitor.socialMedia.facebook)}
        >
          <Ionicons name="logo-facebook" size={18} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: '#C13584' }]}
          onPress={() => Linking.openURL(exhibitor.socialMedia.instagram)}
        >
          <Ionicons name="logo-instagram" size={18} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
          onPress={() => Linking.openURL(exhibitor.socialMedia.twitter)}
        >
          <Ionicons name="logo-twitter" size={18} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.socialButton, { backgroundColor: '#FF0000' }]}
          onPress={() => Linking.openURL(exhibitor.socialMedia.youtube)}
        >
          <Ionicons name="logo-youtube" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderProductsSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Productos Destacados</Text>
      {exhibitor.products.map(product => (
        <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.9}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.productContent}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.productFooter}>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity style={styles.productButton}>
                <Text style={styles.productButtonText}>Más info</Text>
                <ChevronRight size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderNewsSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Últimas Novedades</Text>
      {exhibitor.news.map(item => (
        <TouchableOpacity key={item.id} style={styles.newsCard} activeOpacity={0.9}>
          <Image source={item.image} style={styles.newsImage} />
          <View style={styles.newsContent}>
            <Text style={styles.newsDate}>{item.date}</Text>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsSummary}>{item.summary}</Text>
            <TouchableOpacity style={styles.newsButton}>
              <Text style={styles.newsButtonText}>Leer más</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderEventsSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Agenda de Actividades</Text>
      <View style={styles.eventsContainer}>
        {exhibitor.events.map(event => (
          <TouchableOpacity key={event.id} style={styles.eventCard} activeOpacity={0.9}>
            <LinearGradient
              colors={[COLORS.card, '#2A2A2A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.eventCardGradient}
            >
              <View style={styles.eventDateContainer}>
                <Text style={styles.eventDay}>{event.date.split(' ')[0]}</Text>
                <Text style={styles.eventMonth}>Julio</Text>
              </View>
              
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventDetailsRow}>
                  <Clock size={14} color={COLORS.secondary} style={styles.eventIcon} />
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                <View style={styles.eventDetailsRow}>
                  <MapPin size={14} color={COLORS.secondary} style={styles.eventIcon} />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.addEventButton}>
                <Text style={styles.addEventButtonText}>Agregar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderGallerySection = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Galería</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.galleryContainer}
        contentContainerStyle={styles.galleryContent}
      >
        {exhibitor.gallery.map((image, index) => (
          <TouchableOpacity key={index} style={styles.galleryImageContainer} activeOpacity={0.9}>
            <Image source={image} style={styles.galleryImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return renderAboutSection();
      case 'products':
        return renderProductsSection();
      case 'news':
        return renderNewsSection();
      case 'events':
        return renderEventsSection();
      case 'gallery':
        return renderGallerySection();
      default:
        return renderAboutSection();
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header simplificado con altura fija */}
      <View style={styles.header}>
        {/* Imagen de portada */}
        <Image source={exhibitor.coverPhoto} style={styles.coverPhoto} />
        
        {/* Overlay degradado sobre la imagen */}
        <LinearGradient
          colors={['rgba(18, 18, 18, 0.3)', 'rgba(18, 18, 18, 0.7)', '#121212']}
          style={styles.coverGradient}
        />
        
        {/* Botón atrás */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronDown size={24} color="white" />
        </TouchableOpacity>
        
        {/* Header Content con Logo y Título alineados */}
        <View style={styles.headerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image source={exhibitor.logo} style={styles.logo} />
            {exhibitor.verified && (
              <View style={styles.verifiedBadge}>
                <Star size={12} color="#121212" />
              </View>
            )}
          </View>
          
          {/* Información del expositor */}
          <View style={styles.exhibitorInfo}>
            <Text style={styles.exhibitorName}>{exhibitor.name}</Text>
            <Text style={styles.exhibitorStand}>Stand {exhibitor.stand}</Text>
          </View>
        </View>
        
        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Pestañas de navegación */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          
        >
          <TouchableOpacity
            style={[styles.tab, activeSection === 'about' && styles.activeTab]}
            onPress={() => setActiveSection('about')}
          >
            <Text style={[styles.tabText, activeSection === 'about' && styles.activeTabText]}>
              Acerca de
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'products' && styles.activeTab]}
            onPress={() => setActiveSection('products')}
          >
            <Text style={[styles.tabText, activeSection === 'products' && styles.activeTabText]}>
              Productos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'news' && styles.activeTab]}
            onPress={() => setActiveSection('news')}
          >
            <Text style={[styles.tabText, activeSection === 'news' && styles.activeTabText]}>
              Novedades
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'events' && styles.activeTab]}
            onPress={() => setActiveSection('events')}
          >
            <Text style={[styles.tabText, activeSection === 'events' && styles.activeTabText]}>
              Agenda
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeSection === 'gallery' && styles.activeTab]}
            onPress={() => setActiveSection('gallery')}
          >
            <Text style={[styles.tabText, activeSection === 'gallery' && styles.activeTabText]}>
              Galería
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 200, // Header más pequeño y con altura fija
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  headerContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row', // Logo y título en fila
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
    width: 64, // Logo más pequeño
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.background,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  exhibitorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  exhibitorName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  exhibitorStand: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabsContainer: {
    backgroundColor: COLORS.card,
    height: 48,
    zIndex: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 24,
  },
  tab: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    padding: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  aboutItem: {
    alignItems: 'center',
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
  achievementsContainer: {
    marginBottom: 24,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  achievementIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  achievementText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
  productCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 16,
  },
  productName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 143, 60, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  productButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  newsCard: {
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
  newsImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  newsDate: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 8,
  },
  newsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsSummary: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  newsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  newsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  eventsContainer: {
    marginBottom: 16,
  },
  eventCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventCardGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  eventDateContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDay: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventIcon: {
    marginRight: 6,
  },
  eventDetailText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  addEventButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addEventButtonText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  galleryContainer: {
    marginBottom: 16,
  },
  galleryContent: {
    paddingRight: 16,
  },
  galleryImageContainer: {
    width: width * 0.7,
    height: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ExhibitorProfileScreen;