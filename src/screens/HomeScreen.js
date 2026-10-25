// Inicio: herramienta diaria del agro (precios, noticias del NEA y del país, Agronea TV, redes y oficina).
// Cuando se acerca una edición, arriba aparece el bloque del evento con la cuenta regresiva.
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AgroneaTV from "../components/home/AgroneaTv";
import CountdownTimer from "../components/home/CountdownTimer";
import { C, SectionHeader, PriceCard, PriceCardEmpty, NewsCard, NewsEmpty } from "../components/feed/FeedCards";
import { fetchEvents } from "../api/apiMobile";
import { useMarkets, useNews } from "../api/apiFeed";

// Precios que se muestran en el inicio (el resto, en Mercados)
const HOME_PRICES = [
  { block: "grains", id: "soja", place: "Rosario", unit: "tn" },
  { block: "grains", id: "maiz", place: "Rosario", unit: "tn" },
  { block: "grains", id: "girasol", place: "Rosario", unit: "tn" },
  { block: "cattle", id: "novillos", place: "Cañuelas", unit: "kg vivo" },
];

const SOCIAL = [
  { id: "ig", label: "Instagram", icon: "logo-instagram", color: "#dd2a7b", url: "https://www.instagram.com/agroneachaco/" },
  { id: "fb", label: "Facebook", icon: "logo-facebook", color: "#1877f2", url: "https://www.facebook.com/agroneachaco" },
  { id: "yt", label: "YouTube", icon: "logo-youtube", color: "#d62d20", url: "https://www.youtube.com/@agroneaproducciones" },
];
const WHATSAPP = "https://wa.me/5493794222011";
const OFFICE_MAP = "https://maps.app.goo.gl/rKai7BcMQEF3x6Z46";
// Días antes de la edición en que el inicio pasa a mostrar el evento arriba de todo
const EVENT_WINDOW_DAYS = 60;

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const today = () => {
  const d = new Date();
  return `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
};
const greeting = () => {
  const h = new Date().getHours();
  return h < 13 ? "Buen día" : h < 20 ? "Buenas tardes" : "Buenas noches";
};

// Próxima edición dentro de la ventana, o null
const upcomingEvent = (events) => {
  const now = Date.now();
  return (
    (events || [])
      .filter((e) => e.startDate && new Date(e.startDate).getTime() > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .find((e) => new Date(e.startDate).getTime() - now < EVENT_WINDOW_DAYS * 864e5) || null
  );
};

const EventBlock = ({ event, onBuy }) => (
  <View style={{ gap: 12 }}>
    <CountdownTimer targetDate={event.startDate} eventTitle={event.title} eventDates={event.date} eventLocation={event.location} />
    <TouchableOpacity style={styles.buyBtn} onPress={onBuy} activeOpacity={0.85}>
      <Ionicons name="ticket-outline" size={20} color={C.bg} />
      <Text style={styles.buyBtnText}>Comprar entradas</Text>
    </TouchableOpacity>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const [event, setEvent] = useState(null);
  const { markets } = useMarkets();
  const { news, loading: newsLoading } = useNews();

  useEffect(() => {
    fetchEvents()
      .then((events) => setEvent(upcomingEvent(events)))
      .catch(() => setEvent(null)); // sin conexión: el inicio se ve igual, sin el bloque del evento
  }, []);

  const open = (url) => Linking.openURL(url).catch(() => {});

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.date}>{today()}</Text>
            <Text style={styles.hello}>{greeting()}</Text>
          </View>
          <View style={styles.weather}>
            <Ionicons name="sunny-outline" size={22} color={C.gold} />
            <View>
              <Text style={styles.weatherTemp}>—°</Text>
              <Text style={styles.weatherCity}>Charata</Text>
            </View>
          </View>
        </View>

        {event ? <EventBlock event={event} onBuy={() => navigation.navigate("Shop")} /> : null}

        <SectionHeader title="Mercados de hoy" action="Ver todo" onAction={() => navigation.navigate("Markets")} />
        <View style={styles.grid}>
          {[HOME_PRICES.slice(0, 2), HOME_PRICES.slice(2)].map((row, r) => (
            <View key={r} style={styles.gridRow}>
              {row.map((p) => {
                const item = markets?.[p.block]?.items?.find((i) => i.id === p.id);
                return item ? <PriceCard key={p.id} item={item} place={p.place} unit={p.unit} /> : <PriceCardEmpty key={p.id} />;
              })}
            </View>
          ))}
        </View>

        {/* Noticias, en este orden: Agronea (si hay), NEA, agro del país y muy poca economía */}
        {news?.agronea?.length ? (
          <>
            <SectionHeader title="Novedades de Agronea" />
            {news.agronea.map((n, i) => (
              <NewsCard key={n.id} item={n} big={i === 0} />
            ))}
          </>
        ) : null}

        <SectionHeader title="Noticias del campo · NEA" />
        {news?.nea?.length ? news.nea.map((n, i) => <NewsCard key={n.id} item={n} big={i === 0} />) : <NewsEmpty loading={newsLoading} />}

        {news?.national?.length ? (
          <>
            <SectionHeader title="Agro en el país" />
            {news.national.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </>
        ) : null}

        {news?.economy?.length ? (
          <>
            <SectionHeader title="Economía que importa" />
            {news.economy.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </>
        ) : null}

        <AgroneaTV />

        <SectionHeader title="Seguinos" />
        <View style={styles.gridRow}>
          {SOCIAL.map((n) => (
            <TouchableOpacity key={n.id} style={[styles.social, { backgroundColor: n.color }]} onPress={() => open(n.url)} activeOpacity={0.85}>
              <Ionicons name={n.icon} size={26} color="#fff" />
              <Text style={styles.socialText}>{n.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.office}>
          <Text style={styles.officeTitle}>Oficina Agronea</Text>
          <Text style={styles.officeText}>Charata, Chaco</Text>
          <View style={styles.gridRow}>
            <TouchableOpacity style={[styles.officeBtn, { backgroundColor: "#25d366" }]} onPress={() => open(WHATSAPP)}>
              <Ionicons name="logo-whatsapp" size={18} color={C.bg} />
              <Text style={[styles.officeBtnText, { color: C.bg }]}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.officeBtn, { borderColor: C.borderStrong, borderWidth: 1 }]} onPress={() => open(OFFICE_MAP)}>
              <Ionicons name="navigate-outline" size={18} color={C.text} />
              <Text style={styles.officeBtnText}>Cómo llegar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!event ? (
          <LinearGradient colors={["#1a1a1a", "#0a0a0a"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.next}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextEyebrow}>PRÓXIMA EDICIÓN</Text>
              <Text style={styles.nextTitle}>Agronea 2027</Text>
              <Text style={styles.nextText}>Te avisamos cuando salgan las entradas</Text>
            </View>
            <Ionicons name="notifications-outline" size={26} color={C.gold} />
          </LinearGradient>
        ) : null}

        <View style={{ height: 110 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  date: { color: C.muted, fontSize: 12 },
  hello: { color: C.text, fontSize: 24, fontWeight: "800", marginTop: 2 },
  weather: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  weatherTemp: { color: C.text, fontSize: 15, fontWeight: "700" },
  weatherCity: { color: C.muted, fontSize: 10 },
  grid: { gap: 10 },
  gridRow: { flexDirection: "row", gap: 10 },
  buyBtn: { minHeight: 52, borderRadius: 14, backgroundColor: C.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  buyBtnText: { color: C.bg, fontWeight: "800", fontSize: 16 },
  social: { flex: 1, minHeight: 76, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 6 },
  socialText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  office: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 14, gap: 8 },
  officeTitle: { color: C.text, fontSize: 15, fontWeight: "700" },
  officeText: { color: C.soft, fontSize: 13 },
  officeBtn: { flex: 1, minHeight: 44, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  officeBtnText: { color: C.text, fontWeight: "700", fontSize: 13 },
  next: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  nextEyebrow: { color: C.gold, fontSize: 10, letterSpacing: 2, fontWeight: "600" },
  nextTitle: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 4 },
  nextText: { color: C.soft, fontSize: 12, marginTop: 2 },
});

export default HomeScreen;
