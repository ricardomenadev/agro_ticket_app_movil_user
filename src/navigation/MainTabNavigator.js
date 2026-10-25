import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Importamos las pantallas necesarias
import HomeScreen from "../screens/HomeScreen";
import EventInfoScreen from "../screens/EventInfoScreen";
import ExhibitorsStackNavigator from "./ExhibitorsStackNavigator";
import ShopScreen from "../screens/shop/ShopScreen";
import CheckoutScreen from "../screens/shop/CheckoutScreen";
import PaymentConfirmationScreen from "../screens/shop/PaymentConfirmationScreen";
import PlannerScreen from "../screens/PlannerScreen";
import LoginScreen from "../screens/LoginScreen";
import MyTicketsScreen from "../screens/more/MyTicketsScreen";
import MyProductsScreen from "../screens/more/MyProductsScreen";
import VisitorGuideScreen from "../screens/more/VisitorGuideScreen";
import ImportantInfoScreen from "../screens/more/ImportantInfoScreen";
import MoreMenuScreen from "../screens/more/MoreMenuScreen";
import MercadoPagoWebView from "../screens/shop/MercadoPagoWebView";
import ContactScreen from "../screens/more/ContactScreen";
import AppVersionScreen from "../screens/more/AppVersionScreen";
import TermsConditionsScreen from "../screens/more/TermsConditionsScreen";
import AccommodationScreen from "../screens/more/AccommodationScreen";
import ProvidersScreen from "../screens/more/ProvidersScreen";
import EmergencyScreen from "../screens/more/EmergencyScreen";
import ChatFAB from '../components/common/ChatFAB';

import MarketsScreen from "../screens/MarketsScreen";
import TicketsScreen from "../screens/TicketsScreen";
import { TouchableOpacity, View, Text } from "react-native";

// Importamos el tema y colores
import { COLORS } from "../constants/colors";

const ShopTabButton = ({ onPress, accessibilityState }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.shopBtnWrap}
    accessibilityRole="button"
    accessibilityLabel="Tienda"
    accessibilityState={accessibilityState}
    activeOpacity={0.85}
  >
    <View style={styles.shopBtn}>
      <Ionicons name="bag-handle-outline" size={26} color="#06100a" />
    </View>
    <Text style={styles.shopLabel}>Tienda</Text>
  </TouchableOpacity>
);

const Tab = createBottomTabNavigator();
const MoreStack = createStackNavigator();
const ShopStack = createStackNavigator(); // Nuevo Stack para la tienda

// Stack Navigator para la tienda
const ShopStackNavigator = () => {
  return (
    <ShopStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <ShopStack.Screen name="ShopMain" component={ShopScreen} />
      <ShopStack.Screen name="Checkout" component={CheckoutScreen} />
      {/* <ShopStack.Screen 
        name="MercadoPagoWebView" 
        component={MercadoPagoWebView}
        options={{ headerShown: false }}
      /> */}
      <ShopStack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmationScreen}
        options={{ gestureEnabled: false }}
      />
    </ShopStack.Navigator>
  );
};

// Stack Navigator para la sección "Más"
const MoreStackNavigator = () => {
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.card,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <MoreStack.Screen
        name="MoreMenu"
        component={MoreMenuScreen}
        options={{ title: "Más Opciones" }}
      />
      <MoreStack.Screen
        name="Event"
        component={EventInfoScreen}
        options={{ title: "El evento" }}
      />
      <MoreStack.Screen
        name="Exhibitors"
        component={ExhibitorsStackNavigator}
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar Sesión" }}
      />
      <MoreStack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{ title: "Mis Productos" }}
      />
      <MoreStack.Screen
        name="TermsConditions"
        component={TermsConditionsScreen}
        options={{ title: "Términos y Condiciones" }}
      />
      <MoreStack.Screen
        name="VisitorGuide"
        component={VisitorGuideScreen}
        options={{ title: "Guía del Visitante" }}
      />
      <MoreStack.Screen
        name="Accommodation"
        component={AccommodationScreen}
        options={{ title: "Alojamiento" }}
      />
      <MoreStack.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{ title: "Emergencias" }}
      />
      <MoreStack.Screen
        name="Providers"
        component={ProvidersScreen}
        options={{ title: "Proveedores" }}
      />
      <MoreStack.Screen
        name="ImportantInfo"
        component={ImportantInfoScreen}
        options={{ title: "Información Importante" }}
      />
      {/* AGREGAR ESTAS DOS LÍNEAS: */}
      <MoreStack.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: "Contacto" }}
      />
      <MoreStack.Screen
        name="AppVersion"
        component={AppVersionScreen}
        options={{ title: "Versión de la App" }}
      />
    </MoreStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            paddingBottom:
              Platform.OS === "android" ? insets.bottom + 5 : insets.bottom + 5,
            height:
              Platform.OS === "android"
                ? 60 + insets.bottom
                : 60 + insets.bottom,
          },
        ],
        tabBarActiveTintColor: "#4ade80",
        tabBarInactiveTintColor: "#9fb3a6",
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Markets"
        component={MarketsScreen}
        options={{
          tabBarLabel: "Mercados",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tienda: botón grande en el centro, siempre visible haya o no evento */}
      <Tab.Screen
        name="Shop"
        component={ShopStackNavigator}
        options={{
          tabBarLabel: "Tienda",
          tabBarButton: (props) => <ShopTabButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          tabBarLabel: "Entradas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="More"
        component={MoreStackNavigator}
        options={{
          tabBarLabel: "Más",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    <ChatFAB /> 
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0a140d",
    borderTopWidth: 1,
    borderTopColor: "#213a2a",
    paddingTop: 5,
    position: "absolute",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  shopBtnWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  shopBtn: {
    width: 58,
    height: 58,
    marginTop: -26,
    borderRadius: 29,
    backgroundColor: "#F5C400",
    borderWidth: 4,
    borderColor: "#06100a",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  shopLabel: {
    color: "#F5C400",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
});

export default MainTabNavigator;
