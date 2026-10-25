import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';
import { CATEGORIES } from '../../constants/exhibitors2026';

const CategorySelector = ({ activeCategory, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscá por categoría</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <TouchableOpacity
          style={[styles.chip, activeCategory === null && styles.chipActive]}
          onPress={() => onSelect(null)}
        >
          <Ionicons
            name="apps"
            size={16}
            color={activeCategory === null ? COLORS.background : COLORS.textSecondary}
          />
          <Text style={[styles.chipText, activeCategory === null && styles.chipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isActive ? COLORS.background : COLORS.textSecondary}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: COLORS.background,
    fontWeight: '700',
  },
});

export default CategorySelector;