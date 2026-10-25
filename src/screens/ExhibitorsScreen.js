import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SmartImage from '../components/common/SmartImage';
import ExhibitorsDirectory from '../components/directory/ExhibitorsDirectory';
import { COLORS } from '../styles/theme';
import { EXHIBITORS } from '../constants/exhibitors2026';

const ExhibitorsScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <SmartImage
          source={require('../../assets/logoAgronea2.png')}
          style={styles.headerLogo}
          showLoading={false}
        />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Expositores 2026</Text>
          <Text style={styles.headerSubtitle}>
            {EXHIBITORS.length} empresas · disponible sin internet
          </Text>
        </View>
      </View>

      {/* Directorio offline — maneja su propio scroll */}
      <ExhibitorsDirectory />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default ExhibitorsScreen;