import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  Image
} from 'react-native';
import { ChevronRight, Building2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/theme';
import expositorMobileAPI from '../../api/apiExpositorMobile';

const ExhibitorsPreview = () => {
  const navigation = useNavigation();
  const [expositores, setExpositores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpositores();
  }, []);

  const loadExpositores = async () => {
    try {
      setLoading(true);
      const response = await expositorMobileAPI.getExpositores({ 
        page: 1, 
        limit: 6 // Solo mostrar 6 en el preview
      });
      
      if (response.success) {
        setExpositores(response.expositores || []);
      }
    } catch (error) {
      console.error('Error cargando expositores preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderExpositorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expositorCard}
      onPress={() => navigation.navigate('ExhibitorProfile', { exhibitorId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.logoContainer}>
        {item.logo ? (
          <Image
            source={{ uri: item.logo }}
            style={styles.logo}
            defaultSource={require('../../../assets/images/placeholder.png')}
          />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Text style={styles.logoText}>
              {item.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.expositorName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.expositorStand}>
        Stand {item.stand || 'TBD'}
      </Text>
    </TouchableOpacity>
  );

  const goToExhibitorsScreen = () => {
    navigation.navigate('ExhibitorsStack');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Expositores</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (expositores.length === 0) {
    return null; // No mostrar nada si no hay expositores
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expositores</Text>
        <TouchableOpacity onPress={goToExhibitorsScreen} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Ver todos</Text>
          <ChevronRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expositores}
        keyExtractor={(item) => item.id}
        renderItem={renderExpositorItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  separator: {
    width: 12,
  },
  expositorCard: {
    width: 140,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  expositorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 36, // Para mantener altura consistente
  },
  expositorStand: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ExhibitorsPreview;