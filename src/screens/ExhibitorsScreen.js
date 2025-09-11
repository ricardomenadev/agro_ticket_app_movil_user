import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Search, Filter, MapPin } from "lucide-react-native";
import { COLORS } from "../styles/theme";
import ExhibitorCard from "../components/exhibitors/ExhibitorCard";
import expositorMobileAPI from "../api/apiExpositor";
import SmartImage from '../components/common/SmartImage';
import { Platform } from 'react-native';

const ExhibitorsScreen = ({ navigation }) => {
  // Estados
  const [expositores, setExpositores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });
  const [error, setError] = useState(null);

  // Cargar datos inicial
  useEffect(() => {
    loadExpositores(true);
  }, []);

  // Cargar expositores
  const loadExpositores = async (isInitial = false, searchTerm = "") => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      }

      const params = {
        page: isInitial ? 1 : pagination.page + 1,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await expositorMobileAPI.getExpositores(params);

      if (response.success) {
        const newExpositores = response.expositores || [];

        if (isInitial || searchTerm) {
          setExpositores(newExpositores);
        } else {
          setExpositores((prev) => [...prev, ...newExpositores]);
        }

        setPagination(response.pagination || pagination);
      } else {
        throw new Error(response.message || "Error al cargar expositores");
      }
    } catch (error) {
      console.error("Error cargando expositores:", error);
      setError(error.message);

      if (isInitial) {
        Alert.alert(
          "Error",
          "No se pudieron cargar los expositores. ¿Deseas reintentar?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Reintentar", onPress: () => loadExpositores(true) },
          ]
        );
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Búsqueda
  const handleSearch = useCallback(async (text) => {
    setSearchText(text);

    if (text.length >= 2 || text.length === 0) {
      await loadExpositores(true, text);
    }
  }, []);

  // Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadExpositores(true, searchText);
  }, [searchText]);

  // Cargar más
  const loadMore = useCallback(() => {
    if (!loadingMore && pagination.page < pagination.pages) {
      setLoadingMore(true);
      loadExpositores(false, searchText);
    }
  }, [loadingMore, pagination, searchText]);

  // Renderizar item de expositor
  const renderExpositorItem = ({ item }) => (
    <ExhibitorCard
      exhibitor={item}
      onPress={() =>
        navigation.navigate("ExhibitorProfile", { exhibitorId: item.id })
      }
    />
  );

  // Renderizar separador
  const renderSeparator = () => <View style={styles.separator} />;

  // Renderizar footer
  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Cargando más expositores...</Text>
      </View>
    );
  };

  // Renderizar empty state
  const renderEmptyComponent = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <MapPin
          size={64}
          color={COLORS.textSecondary}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>
          {searchText
            ? "No se encontraron expositores"
            : "No hay expositores disponibles"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {searchText
            ? `No hay resultados para "${searchText}"`
            : "Los expositores aparecerán aquí cuando estén disponibles"}
        </Text>
        {searchText && (
          <TouchableOpacity
            style={styles.clearSearchButton}
            onPress={() => handleSearch("")}
          >
            <Text style={styles.clearSearchText}>Limpiar búsqueda</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Estado de carga inicial
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando expositores...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerOverlay}>
          <SmartImage
            source={require("../../assets/logoAgronea2.png")}
            style={styles.bannerImageInside}
            showLoading={false}
          />
          <View style={styles.textContainer}>
            <Text style={styles.bannerMainText}>
              AGRONEA 2025 - Expositores
            </Text>
            <Text style={styles.bannerSubText}>
              {pagination.total > 0
                ? `${pagination.total} empresas participantes`
                : "Empresas participantes"}
            </Text>
          </View>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search
            size={20}
            color={COLORS.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar expositores..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchText}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lista de expositores */}
      <FlatList
        data={expositores}
        keyExtractor={(item) => item.id}
        renderItem={renderExpositorItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  clearButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  clearSearchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  clearSearchText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bannerContainer: {
  height: 80,
  position: "relative",
  backgroundColor: COLORS.primary + "10",
  marginTop: Platform.OS === 'android' ? 30 : 20,
},
bannerImageInside: {
  width: 60,
  height: 60,
},
bannerOverlay: {
  flex: 1,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: 12,
  flexDirection: "row",
  alignItems: "center",
},
textContainer: {
  marginLeft: 12,
  flex: 1,
},
bannerMainText: {
  color: COLORS.text,
  fontSize: 18,
  fontWeight: "bold",
},
bannerSubText: {
  color: COLORS.textSecondary,
  fontSize: 12,
  marginTop: 2,
},
});

export default ExhibitorsScreen;
