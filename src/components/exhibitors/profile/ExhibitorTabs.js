// src/components/exhibitors/profile/ExhibitorTabs.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../../constants/colors';

const ExhibitorTabs = ({ 
  activeSection, 
  onSectionChange, 
  productCount = 0, 
  newsCount = 0, 
  eventCount = 0 
}) => {
  const tabs = [
    { key: 'about', label: 'Acerca de' },
    // { key: 'products', label: `Productos (${productCount})` },
    { key: 'news', label: `Novedades (${newsCount})` },
    { key: 'events', label: `Agenda (${eventCount})` },
  ];

  return (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeSection === tab.key && styles.activeTab
            ]}
            onPress={() => onSectionChange(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeSection === tab.key && styles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ExhibitorTabs;