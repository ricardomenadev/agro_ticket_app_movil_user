// src/components/home/CronogramaModal.jsx
//
// Modal del cronograma de actividades de los 3 días de Agronea 2026.
// Diseño: tabs por día (Vie/Sáb/Dom) + timeline vertical con nodos.
// Cada actividad se conecta por su hora real; los tipos de evento
// (charla, demostración, remate, sorteo) se distinguen por color e ícono.
//
// NOTA: antes las tarjetas entraban con una animación en cascada (stagger).
// Se eliminó porque, al estar el modal siempre montado (se controla por
// "visible", no se monta/desmonta), esa animación corría con el modal cerrado
// y dejaba al ScrollView con una medición de layout vieja: el contenido se veía
// pero no scrolleaba hasta cambiar de día. Sin la animación, el bug desaparece
// de raíz y la experiencia es la misma.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  ScrollView, Animated, Platform, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Paleta — coherente con la marca Agronea (verde/dorado) ──────────────────
const C = {
  primary:   '#2D7A3A',   // verde Agronea
  primaryDk: '#1E5528',   // verde oscuro (gradiente header)
  gold:      '#C9A227',   // dorado (momentos destacados)
  goldSoft:  '#F3E9C6',   // dorado claro (fondos)
  teal:      '#2B8C8C',   // demostraciones / drive
  bg:        '#F5F7F5',
  card:      '#FFFFFF',
  text:      '#1A2E1C',
  textSub:   '#6B8A6E',
  border:    '#E0EBE1',
  line:      '#CFE0D2',   // línea del timeline
  white:     '#FFFFFF',
};

// ─── Config por tipo de evento ───────────────────────────────────────────────
// Cada tipo define color de nodo, ícono y si es "destacado" (glow).
const TIPO_CONFIG = {
  Apertura:   { color: C.primary, icon: 'sunny-outline',        destacado: false },
  Cierre:     { color: C.textSub, icon: 'moon-outline',         destacado: false },
  Charla:     { color: C.primary, icon: 'mic-outline',          destacado: false },
  Evento:     { color: C.teal,    icon: 'flash-outline',        destacado: false },
  Remate:     { color: C.gold,    icon: 'megaphone-outline',    destacado: true  },
  Sorteo:     { color: C.gold,    icon: 'gift-outline',         destacado: true  },
  Inauguracion:{ color: C.gold,   icon: 'ribbon-outline',       destacado: true  },
};

// Resuelve la config según tipo + título (para destacar inauguración y sorteo)
const getTipoConfig = (item) => {
  const t = (item.titulo || '').toLowerCase();
  if (t.includes('inaugurac')) return TIPO_CONFIG.Inauguracion;
  if (t.includes('sorteo'))    return TIPO_CONFIG.Sorteo;
  if (t.includes('remate'))    return TIPO_CONFIG.Remate;
  return TIPO_CONFIG[item.tipo] || TIPO_CONFIG.Evento;
};

// ─── Datos del cronograma (del programa oficial) ─────────────────────────────
const PROGRAMA = [
  {
    id: 'vie',
    diaCorto: 'VIE',
    diaNum: '3',
    diaLabel: 'Viernes 3 de julio',
    items: [
      { hora: '9:00',  tipo: 'Apertura', titulo: 'Apertura de la muestra', lugar: null },
      { hora: '9:30',  tipo: 'Evento',   titulo: 'Drive Experience', lugar: 'Sector Dinámica' },
      { hora: '10:00', tipo: 'Charla',   titulo: 'Jóvenes Emprendedores', lugar: 'Salón Jóvenes Emprendedores', organiza: 'Banco Chaco / Unicobros' },
      { hora: '11:00', tipo: 'Evento',   titulo: 'Acto de Inauguración — Edición 23°', lugar: 'Entrada Pórtico Principal' },
      { hora: '11:00', tipo: 'Evento',   titulo: 'Tecnologías LIGIER y demostración a escala', lugar: 'Stand BAHNSA S.A.' },
      { hora: '12:00', tipo: 'Charla',   titulo: 'CONINAGRO y Ateneo CRA', lugar: 'Salón Jóvenes Emprendedores' },
      { hora: '14:00', tipo: 'Charla',   titulo: '¿En el Congreso se habla de Agro?', lugar: 'Auditorio General', organiza: 'Barbechando' },
      { hora: '15:00', tipo: 'Evento',   titulo: 'Demostración a campo', lugar: 'Sector Dinámica' },
      { hora: '15:00', tipo: 'Charla',   titulo: 'Tu Voz, Tu Poder: El Arte de Hablar y Liderar', lugar: 'Auditorio General', organiza: 'UNNE' },
      { hora: '16:00', tipo: 'Charla',   titulo: 'UTN FRRe y el desarrollo tecnológico del agro', lugar: 'Auditorio General' },
      { hora: '16:00', tipo: 'Charla',   titulo: 'Taller de acondicionamiento de agua', lugar: 'Stand BAHNSA S.A.' },
      { hora: '18:00', tipo: 'Cierre',   titulo: 'Cierre de la muestra', lugar: null },
    ],
  },
  {
    id: 'sab',
    diaCorto: 'SÁB',
    diaNum: '4',
    diaLabel: 'Sábado 4 de julio',
    items: [
      { hora: '9:00',  tipo: 'Apertura', titulo: 'Apertura de la muestra', lugar: null },
      { hora: '9:00',  tipo: 'Evento',   titulo: 'Drive Experience', lugar: 'Sector Dinámica' },
      { hora: '10:00', tipo: 'Charla',   titulo: 'Innovación y Tecnología para la Ganadería del Futuro', lugar: 'Salón Jóvenes Emprendedores', organiza: 'UTN FRRe' },
      { hora: '11:00', tipo: 'Evento',   titulo: 'Portfolio LIGIER + Buenas prácticas de aplicación', lugar: 'Stand BAHNSA S.A.' },
      { hora: '11:00', tipo: 'Charla',   titulo: 'Ecosistema New Holland — Agricultura digital y de precisión', lugar: 'Auditorio General' },
      { hora: '11:00', tipo: 'Charla',   titulo: 'John Deere en Acción Siembra', lugar: 'Salón Jóvenes Emprendedores', organiza: 'David Sartor e Hijos' },
      { hora: '14:00', tipo: 'Remate',   titulo: '14° Remate de reproductores', lugar: 'Sector Ganadería', organiza: 'Colombo y Colombo' },
      { hora: '14:00', tipo: 'Charla',   titulo: 'SprayXperience: Capacitación en pulverización', lugar: 'Auditorio General', organiza: 'David Sartor e Hijos' },
      { hora: '15:00', tipo: 'Evento',   titulo: 'Demostración a campo', lugar: 'Sector Dinámica' },
      { hora: '15:00', tipo: 'Charla',   titulo: 'Charla con Economista', lugar: 'Auditorio General', organiza: 'FECHACO / Banco Chaco' },
      { hora: '16:00', tipo: 'Charla',   titulo: 'Cáñamo industrial: oportunidades para Chaco', lugar: 'Auditorio General', organiza: 'Fundación Cannabis y Salud NEA' },
      { hora: '18:00', tipo: 'Cierre',   titulo: 'Cierre de la muestra', lugar: null },
    ],
  },
  {
    id: 'dom',
    diaCorto: 'DOM',
    diaNum: '5',
    diaLabel: 'Domingo 5 de julio',
    items: [
      { hora: '9:00',  tipo: 'Apertura', titulo: 'Apertura de la muestra', lugar: null },
      { hora: '9:00',  tipo: 'Evento',   titulo: 'Drive Experience', lugar: 'Sector Dinámica' },
      { hora: '11:00', tipo: 'Evento',   titulo: 'Portfolio LIGIER + reducción de deriva', lugar: 'Stand BAHNSA S.A.' },
      { hora: '15:00', tipo: 'Evento',   titulo: 'Demostración a campo', lugar: 'Sector Dinámica' },
      { hora: '15:00', tipo: 'Evento',   titulo: 'Inicio de espectáculos', lugar: 'Escenario Principal' },
      { hora: '18:00', tipo: 'Sorteo',   titulo: 'Sorteo Veinte Millones', lugar: 'Escenario Principal' },
      { hora: '18:30', tipo: 'Cierre',   titulo: 'Cierre de la muestra', lugar: null },
    ],
  },
];

// ─── Tabs de día con pill deslizante ─────────────────────────────────────────
const DayTabs = ({ activeIndex, onChange }) => {
  const slide = useRef(new Animated.Value(activeIndex)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: activeIndex,
      useNativeDriver: false,
      tension: 70,
      friction: 11,
    }).start();
  }, [activeIndex]);

  // La pill ocupa 1/3 y se desplaza al 0%, 33.33% o 66.66%
  const pillLeft = slide.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0.5%', '33.83%', '67.16%'],
  });

  return (
    <View style={s.tabsWrapper}>
      <Animated.View style={[s.tabPill, { left: pillLeft }]} />
      {PROGRAMA.map((dia, i) => {
        const active = i === activeIndex;
        return (
          <TouchableOpacity
            key={dia.id}
            style={s.tabBtn}
            onPress={() => onChange(i)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabDiaCorto, active && s.tabActiveText]}>{dia.diaCorto}</Text>
            <Text style={[s.tabDiaNum, active && s.tabActiveText]}>{dia.diaNum}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Nodo destacado con glow pulsante ────────────────────────────────────────
const GlowNode = ({ color, icon }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });

  return (
    <View style={s.nodeWrapper}>
      {/* halo animado */}
      <Animated.View
        style={[
          s.nodeGlow,
          { backgroundColor: color, transform: [{ scale: glowScale }], opacity: glowOpacity },
        ]}
      />
      <View style={[s.node, { backgroundColor: color }]}>
        <Ionicons name={icon} size={13} color={C.white} />
      </View>
    </View>
  );
};

// Nodo normal (sin glow)
const PlainNode = ({ color, icon }) => (
  <View style={s.nodeWrapper}>
    <View style={[s.node, { backgroundColor: color }]}>
      <Ionicons name={icon} size={13} color={C.white} />
    </View>
  </View>
);

// ─── Tarjeta de actividad (sin animación de entrada) ─────────────────────────
const TimelineItem = ({ item, isLast }) => {
  const cfg = getTipoConfig(item);

  return (
    <View style={s.row}>
      {/* Columna izquierda: hora */}
      <View style={s.timeCol}>
        <Text style={s.timeText}>{item.hora}</Text>
      </View>

      {/* Columna central: línea + nodo */}
      <View style={s.lineCol}>
        {cfg.destacado
          ? <GlowNode color={cfg.color} icon={cfg.icon} />
          : <PlainNode color={cfg.color} icon={cfg.icon} />}
        {!isLast && <View style={s.lineSegment} />}
      </View>

      {/* Columna derecha: tarjeta */}
      <View style={s.cardCol}>
        <View style={[
          s.card,
          cfg.destacado && { borderColor: cfg.color, backgroundColor: C.goldSoft + '55' },
        ]}>
          <Text style={[s.cardTitle, cfg.destacado && { color: C.primaryDk }]}>
            {item.titulo}
          </Text>
          {item.lugar && (
            <View style={s.cardMetaRow}>
              <Ionicons name="location-outline" size={12} color={C.textSub} />
              <Text style={s.cardMeta}>{item.lugar}</Text>
            </View>
          )}
          {item.organiza && (
            <View style={s.cardMetaRow}>
              <Ionicons name="business-outline" size={12} color={C.textSub} />
              <Text style={s.cardMeta}>{item.organiza}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// ─── Modal principal ─────────────────────────────────────────────────────────
const CronogramaModal = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  const dia = PROGRAMA[activeIndex];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={s.container}>
        {/* Header con gradiente verde Agronea */}
        <LinearGradient
          colors={[C.primaryDk, C.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[s.header, { paddingTop: insets.top + 14 }]}
        >
          <View style={s.headerTop}>
            <View style={s.headerEyebrowWrap}>
              <View style={s.headerDot} />
              <Text style={s.headerEyebrow}>AGRONEA 2026 · 3 DÍAS</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={s.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={20} color={C.white} />
            </TouchableOpacity>
          </View>
          <Text style={s.headerTitle}>Cronograma de actividades</Text>
          <Text style={s.headerSub}>Charlas, demostraciones, remate y espectáculos</Text>

          <DayTabs activeIndex={activeIndex} onChange={setActiveIndex} />
        </LinearGradient>

        {/* Lista del día */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.dayLabel}>{dia.diaLabel}</Text>
          {dia.items.map((item, i) => (
            <TimelineItem
              key={`${dia.id}_${i}`}
              item={item}
              isLast={i === dia.items.length - 1}
            />
          ))}

          {/* Nota al pie */}
          <View style={s.footNote}>
            <Ionicons name="information-circle-outline" size={14} color={C.textSub} />
            <Text style={s.footNoteText}>
              El cronograma puede sufrir modificaciones. Consultá los carteles del predio el día del evento.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerEyebrowWrap: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  headerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.gold },
  headerEyebrow: {
    color: C.goldSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
    letterSpacing: 0.2,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 18,
  },

  // Tabs
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 16,
    padding: 4,
    height: 56,
    position: 'relative',
  },
  tabPill: {
    position: 'absolute',
    top: 4,
    width: '32.5%',
    height: 48,
    backgroundColor: C.white,
    borderRadius: 13,
    zIndex: 0,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabDiaCorto: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  tabDiaNum: {
    fontSize: 18,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  tabActiveText: { color: C.primary },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 20 },
  dayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: C.textSub,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 18,
    marginLeft: 4,
  },

  // Timeline row
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  timeCol: { width: 46, paddingTop: 2, alignItems: 'flex-end', paddingRight: 8 },
  timeText: { fontSize: 13, fontWeight: '800', color: C.text },

  lineCol: { width: 30, alignItems: 'center' },
  nodeWrapper: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  node: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: C.white,
    zIndex: 2,
  },
  nodeGlow: {
    position: 'absolute',
    width: 26, height: 26, borderRadius: 13,
    zIndex: 1,
  },
  lineSegment: {
    width: 2,
    flex: 1,
    minHeight: 30,
    backgroundColor: C.line,
    marginTop: 1,
  },

  // Card
  cardCol: { flex: 1, paddingLeft: 10, paddingBottom: 16 },
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: 'rgba(45,122,58,0.12)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: C.text, lineHeight: 19 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  cardMeta: { fontSize: 12, color: C.textSub, flex: 1 },

  // Footer
  footNote: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  footNoteText: { fontSize: 12, color: C.textSub, lineHeight: 17, flex: 1 },
});

export default CronogramaModal;