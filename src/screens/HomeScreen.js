// Inicio: herramienta diaria del agro (precios, portada de noticias del NEA, el país y economía, Agronea TV y el cierre con oficina, redes y Wesyx).
// Cuando se acerca una edición, arriba aparece el bloque del evento con la cuenta regresiva.
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import AgroneaTV from "../components/home/AgroneaTv";
import CountdownTimer from "../components/home/CountdownTimer";
import AgroneaHero from "../components/home/AgroneaHero";
import HomeFooter from "../components/home/HomeFooter";
import { C, SectionHeader, PriceCard, PriceCardEmpty, NewsCard, NewsEmpty, NewsCover, Chips, NEWS_SECTIONS, leadOf } from "../components/feed/FeedCards";
import { fetchEvents } from "../api/apiMobile";
import { useMarkets, useNews, useWeather } from "../api/apiFeed";

// Ícono según el código de clima de la OMM (0 despejado, 1-3 nubes, 45-48 niebla, 51-82 lluvia, 95+ tormenta)
const weatherIcon = (w) => {
  if (!w || w.code == null) return "partly-sunny-outline";
  const c = w.code;
  if (c === 0) return w.isDay ? "sunny-outline" : "moon-outline";
  if (c <= 2) return w.isDay ? "partly-sunny-outline" : "cloudy-night-outline";
  if (c <= 48) return "cloudy-outline";
  if (c >= 95) return "thunderstorm-outline";
  if (c >= 71 && c <= 77) return "snow-outline";
  return "rainy-outline";
};

// Precios que se muestran en el inicio (el resto, en Mercados)
const HOME_PRICES = [
  { block: "grains", id: "soja", place: "Rosario", unit: "tn" },
  { block: "grains", id: "maiz", place: "Rosario", unit: "tn" },
  { block: "grains", id: "girasol", place: "Rosario", unit: "tn" },
  { block: "cattle", id: "novillos", place: "Cañuelas", unit: "kg vivo" },
];

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
  const weather = useWeather();
  const [sectionId, setSectionId] = useState("nea");
  const leads = NEWS_SECTIONS.map((s) => ({ ...s, item: leadOf(news?.[s.id]) })).filter((l) => l.item);
  const section = NEWS_SECTIONS.find((s) => s.id === sectionId);
  const sectionLead = leadOf(news?.[sectionId]);
  const moreNews = (news?.[sectionId] || []).filter((n) => n !== sectionLead).slice(0, 3);

  useEffect(() => {
    fetchEvents()
      .then((events) => setEvent(upcomingEvent(events)))
      .catch(() => setEvent(null)); // sin conexión: el inicio se ve igual, sin el bloque del evento
  }, []);


  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.date}>{today()}</Text>
            <Text style={styles.hello}>{greeting()}</Text>
          </View>
          <View style={styles.weather}>
            <Ionicons name={weatherIcon(weather)} size={24} color={C.gold} />
            <View>
              <Text style={styles.weatherTemp}>{weather?.temp != null ? `${Math.round(weather.temp)}°` : "—°"}</Text>
              <Text style={styles.weatherCity}>
                {weather?.max != null ? `${Math.round(weather.max)}° / ${Math.round(weather.min)}°` : "Charata"}
              </Text>
              {weather?.rain != null ? <Text style={styles.weatherCity}>💧 {weather.rain}% · Charata</Text> : null}
            </View>
          </View>
        </View>

        {event ? <EventBlock event={event} onBuy={() => navigation.navigate("Shop")} /> : null}

        <AgroneaHero agroneaNews={news?.agronea?.[0]} />

        <SectionHeader title="Mercados de hoy" action="Ver todo" onAction={() => navigation.navigate("Markets", { view: "prices" })} />
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

        {/* Portada: la principal del NEA grande y la del país y la de economía de a dos */}
        <SectionHeader title="Lo más importante del agro" />
        {leads.length ? (
          <View style={{ gap: 8 }}>
            <NewsCover item={leads[0].item} label={leads[0].label} />
            {leads.length > 1 ? (
              <View style={styles.gridRow}>
                {leads.slice(1).map((l) => (
                  <NewsCover key={l.id} item={l.item} label={l.label} half />
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <NewsEmpty loading={newsLoading} />
        )}

        {/* Las que siguen, de a una sección por vez; el resto en Mercados y noticias */}
        {leads.length ? (
          <>
            <SectionHeader title="Más noticias del campo" />
            <Chips options={NEWS_SECTIONS} value={section.id} onChange={setSectionId} />
            {moreNews.length ? moreNews.map((n) => <NewsCard key={n.id} item={n} />) : <Text style={styles.noMore}>Hoy no hay más noticias de {section.label}.</Text>}
            <TouchableOpacity style={styles.moreBtn} onPress={() => navigation.navigate("Markets", { view: "news", section: section.id })} activeOpacity={0.85}>
              <Text style={styles.moreBtnText}>{section.more}</Text>
              <Ionicons name="chevron-forward" size={16} color={C.gold} />
            </TouchableOpacity>
          </>
        ) : null}

        <AgroneaTV />

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

        <HomeFooter />

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
  noMore: { color: C.muted, fontSize: 13, paddingVertical: 6 },
  moreBtn: { minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: C.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  moreBtnText: { color: C.gold, fontWeight: "700", fontSize: 14 },
  buyBtn: { minHeight: 52, borderRadius: 14, backgroundColor: C.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  buyBtnText: { color: C.bg, fontWeight: "800", fontSize: 16 },
  next: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  nextEyebrow: { color: C.gold, fontSize: 10, letterSpacing: 2, fontWeight: "600" },
  nextTitle: { color: C.text, fontSize: 18, fontWeight: "800", marginTop: 4 },
  nextText: { color: C.soft, fontSize: 12, marginTop: 2 },
});

export default HomeScreen;
