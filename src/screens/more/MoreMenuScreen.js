import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const MenuItem = ({ title, icon, onPress, color = COLORS.primary }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const MoreMenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image
            source={require('../../../assets/logoAgronea2.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Bienvenido a AGRONEA PRODUCCIONES</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <MenuItem
            title="Guía del Visitante"
            icon="compass"
            onPress={() => navigation.navigate("VisitorGuide")}
            color="#2196F3"
          />
          <MenuItem
            title="Información Importante"
            icon="information-circle"
            onPress={() => navigation.navigate("ImportantInfo")}
            color="#FF9800"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <MenuItem
            title="Términos y Condiciones"
            icon="document-text"
            onPress={() => navigation.navigate("TermsConditions")}
            color="#9C27B0"
          />
          <MenuItem
            title="Contacto"
            icon="mail"
            onPress={() => navigation.navigate("Contact")}
            color="#00BCD4"
          />
          <MenuItem
            title="Versión de la App"
            icon="code-slash"
            onPress={() => navigation.navigate("AppVersion")}
            color="#607D8B"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginBottom: 50,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
});

export default MoreMenuScreen;