import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../styles/theme";
import CronogramaModal from "../components/home/CronogramaModal";
import DownloadCroquis from "../components/directory/DownloadCroquis";

// ─── Componentes reutilizables ────────────────────────────────────────────────

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.accentLine} />
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.accentLine} />
  </View>
);

const InfoCard = ({ title, icon, children }) => (
  <View style={styles.infoCard}>
    <View style={styles.infoCardHeader}>
      <View style={styles.infoCardIconContainer}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.infoCardTitle}>{title}</Text>
    </View>
    <View style={styles.infoCardContent}>{children}</View>
  </View>
);

const InfoRow = ({ icon, label, value, highlight }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoRowIcon}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    </View>
    <View style={styles.infoRowText}>
      {label && <Text style={styles.infoRowLabel}>{label}</Text>}
      <Text style={[styles.infoRowValue, highlight && styles.infoRowValueHighlight]}>
        {value}
      </Text>
    </View>
  </View>
);

const PriceBadge = ({ label, price, highlight }) => (
  <View style={[styles.priceBadge, highlight && styles.priceBadgeHighlight]}>
    <Text style={[styles.priceBadgeLabel, highlight && styles.priceBadgeLabelHighlight]}>
      {label}
    </Text>
    <Text style={[styles.priceBadgePrice, highlight && styles.priceBadgePriceHighlight]}>
      {price}
    </Text>
  </View>
);

const AccesoRow = ({ icon, texto }) => (
  <View style={styles.accesoRow}>
    <View style={styles.accesoIcon}>
      <Ionicons name={icon} size={15} color={COLORS.primary} />
    </View>
    <Text style={styles.accesoText}>{texto}</Text>
  </View>
);

const ContactButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.contactButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.contactButtonIcon}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
    </View>
    <Text style={styles.contactButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Banner de acceso al cronograma — destacado, con brillo dorado animado ───
// Es la "firma" visual de la pantalla: un CTA grande que invita a abrir el
// cronograma completo. El borde dorado pulsa sutilmente para llamar la atención.
const CronogramaBanner = ({ onPress }) => {
  // Animación de brillo del borde (loop suave)
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(shine, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // El borde interpola entre dorado tenue y dorado intenso
  const borderColor = shine.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(201,162,39,0.35)", "rgba(201,162,39,0.9)"],
  });

  return (
    <Animated.View style={[styles.cronoBannerWrapper, { borderColor }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient
          colors={["#1E5528", "#2D7A3A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cronoBanner}
        >
          <View style={styles.cronoBannerLeft}>
            <View style={styles.cronoBannerBadge}>
              <View style={styles.cronoBannerDot} />
              <Text style={styles.cronoBannerBadgeText}>3 DÍAS DE ACTIVIDADES</Text>
            </View>
            <Text style={styles.cronoBannerTitle}>Ver cronograma completo</Text>
            <Text style={styles.cronoBannerSub}>
              Charlas, demostraciones, remate y espectáculos
            </Text>
          </View>
          <View style={styles.cronoBannerIcon}>
            <Ionicons name="calendar-outline" size={26} color={COLORS.card} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Botón secundario dentro de la sección Programa
const CronogramaRowButton = ({ onPress }) => (
  <TouchableOpacity style={styles.cronoRowBtn} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cronoRowIcon}>
      <Ionicons name="time-outline" size={20} color={COLORS.primary} />
    </View>
    <View style={styles.cronoRowText}>
      <Text style={styles.cronoRowTitle}>Cronograma de los 3 días</Text>
      <Text style={styles.cronoRowSub}>Tocá para ver el detalle por día</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
  </TouchableOpacity>
);

// ─── Pantalla principal ───────────────────────────────────────────────────────

const EventInfoScreen = () => {
  // Estado del modal de cronograma
  const [cronogramaVisible, setCronogramaVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Información del Evento</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <LinearGradient colors={[COLORS.primary + "40", COLORS.background]} style={styles.eventHeader}>
          <Image source={require("../../assets/images/logo_agronea_2026.png")} style={styles.eventLogo} resizeMode="contain" />
          <Image source={require("../../assets/images/ecosistema.png")} style={styles.ecosistemaLogo} resizeMode="contain" />
          <View style={styles.eventDateBadge}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.secondary} />
            <Text style={styles.eventDateText}>3, 4 y 5 de Julio 2026</Text>
          </View>
          <View style={styles.eventLocationRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.textSecondary} />
            <Text style={styles.eventLocationText}>Km 72.5 Ruta 89 · 5 km de Charata, Chaco</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: "3", label: "Días" },
            { value: "+100", label: "Expositores" },
            { value: "9 a 18hs", label: "Horario" },
          ].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── ACCESO DESTACADO AL CRONOGRAMA (banner arriba) ── */}
        <CronogramaBanner onPress={() => setCronogramaVisible(true)} />

        {/* ── HORARIOS ── */}
        <SectionHeader title="Horarios" />

        <InfoCard title="Horario del Evento" icon="time-outline">
          <InfoRow icon="sunny-outline" label="Apertura al público" value="9:00 hs — todos los días" />
          <InfoRow icon="moon-outline" label="Cierre" value="18:00 hs — todos los días" />
          <InfoRow
            icon="flag-outline"
            label="Acto inaugural"
            value="Viernes 3 de julio a las 11:00 hs"
            highlight
          />
          <View style={styles.warningRow}>
            <Ionicons name="alert-circle-outline" size={15} color={COLORS.secondary} />
            <Text style={styles.warningText}>No se permite el reingreso al predio una vez que se sale.</Text>
          </View>
        </InfoCard>

        {/* ── ENTRADAS ── */}
        <SectionHeader title="Entradas" />

        <InfoCard title="Precios" icon="ticket-outline">
          <View style={styles.pricesRow}>
            <PriceBadge label="Hasta el 2 de julio" price="$10.000" highlight />
            <PriceBadge label="Desde el 3 de julio" price="$15.000" />
          </View>
          <View style={styles.divider} />
          <InfoRow icon="phone-portrait-outline" label="Online" value="agronea.store — con tarjeta de crédito" />
          <InfoRow icon="storefront-outline" label="En el predio" value="Los días del evento — efectivo o tarjeta" />
        </InfoCard>

        <InfoCard title="Accesos Especiales" icon="people-outline">
          <AccesoRow
            icon="school-outline"
            texto="Menores de 9 años — entrada gratuita"
          />
          <AccesoRow
            icon="book-outline"
            texto="Escuelas — gratis el viernes 3 de julio, con lista de alumnos en papel membretado"
          />
          <AccesoRow
            icon="library-outline"
            texto="Universitarios de Agronomía y Veterinaria — gratis viernes 3 y sábado 4, con libreta al día. El domingo abonan la entrada"
          />
          <View style={styles.warningRow}>
            <Ionicons name="information-circle-outline" size={15} color={COLORS.secondary} />
            <Text style={styles.warningText}>No hay otros descuentos. Solo el precio anticipado hasta el 2 de julio.</Text>
          </View>
        </InfoCard>

        {/* Descarga del croquis del predio */}
        {/* <View style={styles.croquisWrapper}>
          <DownloadCroquis />
        </View> */}

        {/* ── PROGRAMA ── */}
        <SectionHeader title="Programa" />

        {/* Acceso al cronograma dentro de la sección programa */}
        <View style={styles.programContainer}>
          <CronogramaRowButton onPress={() => setCronogramaVisible(true)} />

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardIconContainer}>
                <Ionicons name="construct-outline" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.infoCardTitle}>Demostraciones a Campo</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoText}>
                Pruebas en vivo de maquinaria agrícola y nuevas tecnologías en el sector de dinámicas a campo. Todos los días a las 15:00 hs.
              </Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardIconContainer}>
                <Ionicons name="car-sport-outline" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.infoCardTitle}>Drive Experience</Text>
            </View>
            <View style={styles.infoCardContent}>
              <Text style={styles.infoText}>
                Viví la experiencia de manejar maquinaria agrícola en el sector dinámica. Viernes desde las 9:30, sábado y domingo de 9 a 15 hs.
              </Text>
            </View>
          </View>
        </View>

        {/* ── GANADERÍA ── */}
        <SectionHeader title="Ganadería" />

        <InfoCard title="Remate Ganadero" icon="megaphone-outline">
          <Text style={styles.infoText}>
            Del 3 al 5 de julio, todos los integrantes de la cadena ganadera se reúnen en el sector ganadero de Agronea 2026.
          </Text>
          <InfoRow icon="calendar-outline" label="Fecha del remate" value="Sábado 4 de julio, 14:00 hs" highlight />
          <InfoRow icon="person-outline" label="Firma martillera" value="Colombo y Colombo" />
          <InfoRow icon="people-outline" label="Acceso" value="Abierto al público general — sin costo de inscripción" />
          <View style={styles.divider} />
          <Text style={styles.infoTextSmall}>Cierre de inscripción de animales: 2 de julio. Jura veterinaria: 2 de julio. Jura de clasificación: 3 de julio.</Text>
        </InfoCard>

        {/* ── SERVICIOS EN EL PREDIO ── */}
        <SectionHeader title="Servicios en el predio" />

        <InfoCard title="Lo que vas a encontrar" icon="grid-outline">
          <AccesoRow icon="restaurant-outline" texto="Gastronomía: food trucks, comedor Adaka, comedor Cooperativa y puesto de comidas saludables" />
          <AccesoRow icon="cash-outline" texto="Cajero automático NBCH dentro del predio" />
          <AccesoRow icon="medkit-outline" texto="Emergencias: puesto Alerta Roja con atención médica permanente" />
          <AccesoRow icon="car-outline" texto="Estacionamiento pago para autos y motos" />
          <AccesoRow icon="construct-outline" texto="Parque cerrado de maquinarias y dinámicas a campo" />
          <AccesoRow icon="happy-outline" texto="Parque de atracciones para niños" />
          <AccesoRow icon="mic-outline" texto="Auditorio para charlas y escenario principal" />
        </InfoCard>

        {/* ── CÓMO LLEGAR ── */}
        <SectionHeader title="Cómo llegar" />

        <InfoCard title="Ubicación" icon="navigate-outline">
          <InfoRow icon="location-outline" label="Dirección" value="Km 72.5 de la Ruta Nacional 89, a 5 km de Charata, Chaco" />
          <InfoRow icon="time-outline" label="Desde Charata" value="Aproximadamente 10 minutos" />
          <InfoRow icon="car-outline" label="Transporte" value="Remises de empresas locales disponibles" />
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => Linking.openURL("https://maps.google.com/?q=Km+72.5+Ruta+89+Charata+Chaco")}
            activeOpacity={0.8}
          >
            <Ionicons name="map-outline" size={16} color={COLORS.card} />
            <Text style={styles.mapBtnText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </InfoCard>

        {/* ── CONTACTO ── */}
        <SectionHeader title="Contacto" />

        <InfoCard title="Contacto Oficial" icon="call-outline">
          <Text style={styles.infoText}>
            Escribinos para consultas sobre entradas, expositores o información general del evento.
          </Text>
          <View style={styles.contactButtons}>
            <ContactButton icon="logo-whatsapp" label="WhatsApp" onPress={() => Linking.openURL("https://wa.me/5493794222011")} />
            <ContactButton icon="mail-outline" label="Email" onPress={() => Linking.openURL("mailto:agroneacharata@gmail.com")} />
            <ContactButton icon="globe-outline" label="Web" onPress={() => Linking.openURL("https://www.agronea.store")} />
          </View>
          <View style={styles.divider} />
          <InfoRow icon="business-outline" label="Oficina" value="Caseros 539, Charata, Chaco" />
          <InfoRow icon="time-outline" label="Horario oficina" value="Lunes a viernes 8 a 12hs y 16 a 20hs. Sábados 8 a 12hs." />
        </InfoCard>

        {/* Footer */}
        <View style={styles.footerCard}>
          <LinearGradient colors={[COLORS.primary + "20", "transparent"]} style={styles.footerCardGradient}>
            <Ionicons name="leaf-outline" size={36} color={COLORS.primary} />
            <Text style={styles.footerTitle}>Te esperamos en Agronea 2026</Text>
            <Text style={styles.footerText}>
              Tres días para vivir el ecosistema de oportunidades del agro del norte argentino.
            </Text>
          </LinearGradient>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal del cronograma — se monta una vez y se controla por estado */}
      <CronogramaModal
        visible={cronogramaVisible}
        onClose={() => setCronogramaVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingVertical: 16, paddingHorizontal: 20, alignItems: "center", backgroundColor: COLORS.primary },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
  scrollView: { flex: 1 },

  // Hero
  eventHeader: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 20 },
  eventLogo: { width: 260, height: 65, marginBottom: 12 },
  ecosistemaLogo: { width: 260, height: 65, marginBottom: 20 },
  eventDateBadge: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 10, gap: 8, borderWidth: 1, borderColor: COLORS.secondary + "40" },
  eventDateText: { fontSize: 14, fontWeight: "bold", color: COLORS.secondary },
  eventLocationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eventLocationText: { fontSize: 13, color: COLORS.textSecondary },

  // Stats
  statsRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, marginHorizontal: 16, borderRadius: 16, paddingVertical: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "900", color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "500" },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },

  // Banner cronograma (firma visual)
  cronoBannerWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 18,
    borderWidth: 2,
    overflow: "hidden",
  },
  cronoBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 14,
  },
  cronoBannerLeft: { flex: 1 },
  cronoBannerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,162,39,0.22)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  cronoBannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F3E9C6" },
  cronoBannerBadgeText: { fontSize: 9, fontWeight: "800", color: "#F3E9C6", letterSpacing: 1 },
  cronoBannerTitle: { fontSize: 18, fontWeight: "900", color: COLORS.card, letterSpacing: 0.2 },
  cronoBannerSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 3 },
  cronoBannerIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center", justifyContent: "center",
  },

  // Botón cronograma en sección programa
  cronoRowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary + "40",
    gap: 12,
  },
  cronoRowIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cronoRowText: { flex: 1 },
  cronoRowTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  cronoRowSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Sección
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, marginBottom: 16, gap: 12 },
  accentLine: { flex: 1, height: 1, backgroundColor: COLORS.primary + "60" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text, letterSpacing: 1.2, textTransform: "uppercase" },

  // Info cards
  infoCard: { backgroundColor: COLORS.card, borderRadius: 16, marginHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  infoCardHeader: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoCardIconContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center", marginRight: 12 },
  infoCardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  infoCardContent: { padding: 16, gap: 10 },
  infoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  infoTextSmall: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },

  // Info rows
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoRowIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  infoRowText: { flex: 1 },
  infoRowLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  infoRowValue: { fontSize: 14, color: COLORS.text, fontWeight: "500", lineHeight: 20 },
  infoRowValueHighlight: { color: COLORS.primary, fontWeight: "700" },

  // Warning
  warningRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: COLORS.secondary + "12", borderRadius: 10, padding: 10 },
  warningText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, flex: 1 },

  // Precios
  pricesRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  priceBadge: { flex: 1, backgroundColor: COLORS.background, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  priceBadgeHighlight: { backgroundColor: COLORS.primary + "15", borderColor: COLORS.primary + "50" },
  priceBadgeLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: "center", marginBottom: 6, lineHeight: 16 },
  priceBadgeLabelHighlight: { color: COLORS.primary },
  priceBadgePrice: { fontSize: 22, fontWeight: "900", color: COLORS.text },
  priceBadgePriceHighlight: { color: COLORS.primary },

  // Accesos
  accesoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  accesoIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.primary + "15", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  accesoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },

  // Programa
  programContainer: { marginHorizontal: 16, marginBottom: 16, gap: 10 },

  // Wrapper del croquis (márgenes laterales como las cards)
  croquisWrapper: { marginHorizontal: 16, marginBottom: 8 },

  // Mapa btn
  mapBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, marginTop: 4 },
  mapBtnText: { fontSize: 14, fontWeight: "700", color: COLORS.card },

  // Contacto
  contactButtons: { flexDirection: "row", justifyContent: "space-around", marginBottom: 4 },
  contactButton: { alignItems: "center", flex: 1 },
  contactButtonIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primary + "20", alignItems: "center", justifyContent: "center", marginBottom: 8, borderWidth: 1, borderColor: COLORS.primary + "30" },
  contactButtonLabel: { fontSize: 12, color: COLORS.textSecondary, textAlign: "center", fontWeight: "500" },

  // Footer
  footerCard: { marginHorizontal: 16, marginBottom: 30, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  footerCardGradient: { padding: 24, alignItems: "center" },
  footerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text, textAlign: "center", marginTop: 14, marginBottom: 10 },
  footerText: { fontSize: 14, color: COLORS.textSecondary, textAlign: "center", lineHeight: 22 },
});

export default EventInfoScreen;