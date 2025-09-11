// src/components/exhibitors/ExhibitorProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants/colors";
import expositorMobileAPI from "../../api/apiExpositor";

// Componentes refactorizados
import ExhibitorHeader from "./profile/ExhibitorHeader";
import ExhibitorTabs from "./profile/ExhibitorTabs";
import AboutSection from "./profile/AboutSection";
import ProductsSection from "./profile/ProductsSection";
import NewsSection from "./profile/NewsSection";
import EventsSection from "./profile/EventsSection";
import LoadingScreen from "./shared/LoadingScreen";
import ErrorScreen from "./shared/ErrorScreen";

const ExhibitorProfileScreen = ({ route, navigation }) => {
  const { exhibitorId } = route.params;

  // Estados
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [exhibitorData, setExhibitorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadExhibitorData();
  }, [exhibitorId]);

  const loadExhibitorData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar perfil principal
      const profileResponse = await expositorMobileAPI.getExpositorProfile(
        exhibitorId
      );

      if (!profileResponse.success) {
        throw new Error(profileResponse.message || "Error al cargar expositor");
      }

      console.log(
        "🔍 Datos completos del expositor:",
        JSON.stringify(profileResponse.expositor, null, 2)
      );
      console.log("🔍 Logo URL:", profileResponse.expositor.logo);
      console.log("🔍 Cover URL:", profileResponse.expositor.coverImage);

      setExhibitorData(profileResponse.expositor);

      // Cargar datos adicionales en paralelo
      const [productsResponse, newsResponse, eventsResponse] =
        await Promise.all([
          expositorMobileAPI.getExpositorProducts(exhibitorId),
          expositorMobileAPI.getExpositorNews(exhibitorId),
          expositorMobileAPI.getExpositorEvents(exhibitorId),
        ]);

      // Establecer datos (usar arrays vacíos si hay error)
      setProducts(productsResponse.success ? productsResponse.products : []);
      setNews(newsResponse.success ? newsResponse.news : []);
      setEvents(eventsResponse.success ? eventsResponse.events : []);
    } catch (error) {
      console.error("Error cargando datos del expositor:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar retry
  const handleRetry = () => {
    loadExhibitorData();
  };

  // Manejar volver
  const handleBack = () => {
    navigation.goBack();
  };

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection exhibitor={exhibitorData} />;
      case "products":
        return <ProductsSection products={products} />;
      case "news":
        return <NewsSection news={news} />;
      case "events":
        return <EventsSection events={events} />;
      default:
        return <AboutSection exhibitor={exhibitorData} />;
    }
  };

  // Estados de carga y error
  if (loading) {
    return <LoadingScreen message="Cargando expositor..." />;
  }

  if (error || !exhibitorData) {
    return (
      <ErrorScreen
        error={error || "Error al cargar expositor"}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header con banner y logo */}
      <ExhibitorHeader exhibitor={exhibitorData} onBack={handleBack} />

      {/* Pestañas de navegación */}
      <ExhibitorTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        productCount={products.length}
        newsCount={news.length}
        eventCount={events.length}
      />

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
});

export default ExhibitorProfileScreen;
