// src/screens/ChatScreen.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Animated, ScrollView, Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EXHIBITORS_DATA } from '../constants/exhibitorsData2026';
import { sendMessage, sendFeedback, getEventDataInstant, refreshEventDataFromServer, formatExpositorResponse } from '../services/chatService';
const C = {
  bg:           '#F5F7F5',
  card:         '#FFFFFF',
  primary:      '#2D7A3A',
  primaryLight: '#E8F5EA',
  primaryMid:   '#4A9B58',
  text:         '#1A2E1C',
  textSub:      '#6B8A6E',
  border:       '#E0EBE1',
  userBubble:   '#2D7A3A',
  error:        '#C0392B',
  shadow:       'rgba(45,122,58,0.10)',
};

const CATEGORY_CONFIG = {
  maquinaria:    { icon: 'construct-outline',           label: 'Maquinaria' },
  insumos:       { icon: 'leaf-outline',                label: 'Insumos y Semillas' },
  vehiculos:     { icon: 'car-outline',                 label: 'Vehículos' },
  servicios:     { icon: 'laptop-outline',              label: 'Servicios y Tecnología' },
  financiero:    { icon: 'card-outline',                label: 'Financiero' },
  institucional: { icon: 'school-outline',              label: 'Institucional' },
  gastronomia:   { icon: 'restaurant-outline',          label: 'Gastronomía' },
  otros:         { icon: 'ellipsis-horizontal-outline', label: 'Otros' },
};

const MENU_VISITANTE = [
  { id: 'fechas',              label: 'Fechas y horarios',   icon: 'calendar-outline' },
  { id: 'entradas',            label: 'Entradas y precios',  icon: 'ticket-outline' },
  { id: 'como_llegar',         label: 'Cómo llegar',         icon: 'navigate-outline' },
  { id: 'estacionamiento',     label: 'Estacionamiento',     icon: 'car-outline' },
  { id: 'comida',              label: 'Dónde comer',         icon: 'restaurant-outline' },
  { id: 'primeros_auxilios',   label: 'Emergencias',         icon: 'medkit-outline' },
  { id: 'expositores_general', label: 'Expositores',         icon: 'business-outline' },
  { id: 'charlas',             label: 'Charlas y auditorio', icon: 'mic-outline' },
  { id: 'maquinarias',         label: 'Maquinarias',         icon: 'construct-outline' },
  { id: 'cajero',              label: 'Cajero / Pagos',      icon: 'cash-outline' },
  { id: 'banos',               label: 'Baños',               icon: 'water-outline' },
  { id: 'contacto',            label: 'Contacto',            icon: 'call-outline' },
];

const MENU_EXPOSITOR = [
  { id: 'expo_instalacion',           label: 'Armado de stand',    icon: 'hammer-outline' },
  { id: 'expo_desmontaje',            label: 'Desarme',            icon: 'archive-outline' },
  { id: 'expo_credenciales_detalle',  label: 'Credenciales',       icon: 'id-card-outline' },
  { id: 'expo_invitaciones',          label: 'Invitaciones',       icon: 'mail-outline' },
  { id: 'expo_electricidad_detalle',  label: 'Electricidad',       icon: 'flash-outline' },
  { id: 'expo_agua',                  label: 'Agua',               icon: 'water-outline' },
  { id: 'expo_seguro',                label: 'Seguro obligatorio', icon: 'shield-checkmark-outline' },
  { id: 'expo_limpieza',              label: 'Limpieza',           icon: 'brush-outline' },
  { id: 'expo_seguridad',             label: 'Seguridad nocturna', icon: 'lock-closed-outline' },
  { id: 'expo_acreditaciones',        label: 'Acreditaciones',     icon: 'person-circle-outline' },
  { id: 'expo_normas',                label: 'Reglamento',         icon: 'document-text-outline' },
  { id: 'expo_contacto_organizacion', label: 'Contacto org.',      icon: 'call-outline' },
];

// ─── TabSelector ──────────────────────────────────────────────────────────────

const TabSelector = ({ activeTab, onTabChange }) => {
  const slideAnim = useRef(new Animated.Value(activeTab === 'visitante' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: activeTab === 'visitante' ? 0 : 1,
      useNativeDriver: false,
      tension: 80,
      friction: 12,
    }).start();
  }, [activeTab]);

  const pillLeft = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['2%', '50%'],
  });

  return (
    <View style={ts.tabContainer}>
      <Animated.View style={[ts.tabPill, { left: pillLeft }]} />
      <TouchableOpacity style={ts.tabBtn} onPress={() => onTabChange('visitante')} activeOpacity={0.8}>
        <Ionicons name="walk-outline" size={14} color={activeTab === 'visitante' ? C.card : C.textSub} />
        <Text style={[ts.tabLabel, activeTab === 'visitante' && ts.tabLabelActive]}>Visitante</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ts.tabBtn} onPress={() => onTabChange('expositor')} activeOpacity={0.8}>
        <Ionicons name="storefront-outline" size={14} color={activeTab === 'expositor' ? C.card : C.textSub} />
        <Text style={[ts.tabLabel, activeTab === 'expositor' && ts.tabLabelActive]}>Expositor</Text>
      </TouchableOpacity>
    </View>
  );
};

const ts = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: C.primaryLight,
    borderRadius: 24,
    padding: 3,
    position: 'relative',
    height: 38,
    marginTop: 10,
    marginHorizontal: 16,
    marginBottom: 2,
  },
  tabPill: {
    position: 'absolute',
    top: 3,
    width: '48%',
    height: 32,
    backgroundColor: C.primary,
    borderRadius: 20,
    zIndex: 0,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    zIndex: 1,
  },
  tabLabel: { fontSize: 13, fontWeight: '600', color: C.textSub },
  tabLabelActive: { color: C.card },
});

// ─── MenuGrid ─────────────────────────────────────────────────────────────────

const MenuGrid = ({ menuItems, eventData, onSelect }) => {
  if (!menuItems || !eventData) return null;
  return (
    <View style={s.menuGridWrapper}>
      <View style={s.menuGrid}>
        {menuItems.map((item) => {
          const faq = eventData.faqs.find(f => f.id === item.id);
          if (!faq) return null;
          return (
            <TouchableOpacity key={item.id} style={s.menuGridBtn} onPress={() => onSelect(faq)} activeOpacity={0.75}>
              <View style={s.menuGridIcon}>
                <Ionicons name={item.icon || 'help-circle-outline'} size={18} color={C.primary} />
              </View>
              <Text style={s.menuGridLabel} numberOfLines={2}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── RelatedChips ─────────────────────────────────────────────────────────────

const RelatedChips = ({ relatedFaqs, eventData, onSelect, onExpand }) => {
  const [showAll, setShowAll] = useState(false);
  if (!eventData) return null;
  const items = (relatedFaqs || []).map(id => eventData.faqs.find(f => f.id === id)).filter(Boolean);

  return (
    <View style={s.chipsWrapper}>
      <Text style={s.chipsLabel}>Seguir consultando</Text>
      {items.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsScroll}>
          {items.map(faq => (
            <TouchableOpacity key={faq.id} style={s.chip} onPress={() => onSelect(faq)} activeOpacity={0.75}>
              <Text style={s.chipText}>{faq.pregunta}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity
        style={s.btnVerTodos}
        onPress={() => { const next = !showAll; setShowAll(next); if (next && onExpand) onExpand(); }}
        activeOpacity={0.75}
      >
        <Ionicons name={showAll ? 'chevron-up' : 'chevron-down'} size={13} color={C.primary} />
        <Text style={s.btnVerTodosText}>{showAll ? 'Cerrar temas' : 'Ver todos los temas'}</Text>
      </TouchableOpacity>
      {showAll && (
        <View style={s.allTopicsPanel}>
          <MenuGrid
            menuItems={MENU_VISITANTE}
            eventData={eventData}
            onSelect={(faq) => { setShowAll(false); onSelect(faq); }}
          />
        </View>
      )}
    </View>
  );
};

// ─── ExpositorCategorias ──────────────────────────────────────────────────────

const ExpositorCategorias = ({ onSelectCategory }) => {
  const counts = EXHIBITORS_DATA.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + 1;
    return acc;
  }, {});
  return (
    <View style={s.expositorWrapper}>
      <Text style={s.sectionLabel}>Categorías</Text>
      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
        const count = counts[key] || 0;
        if (!count) return null;
        return (
          <TouchableOpacity key={key} style={s.categoryBtn} onPress={() => onSelectCategory(key)} activeOpacity={0.75}>
            <View style={s.categoryIcon}>
              <Ionicons name={config.icon} size={19} color={C.primary} />
            </View>
            <View style={s.categoryTextWrapper}>
              <Text style={s.categoryLabel}>{config.label}</Text>
              <Text style={s.categoryCount}>{count} expositores</Text>
            </View>
            <Ionicons name="chevron-forward" size={15} color={C.textSub} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── ExpositorLista ───────────────────────────────────────────────────────────

const ExpositorLista = ({ category, onSelectExpositor, onBack }) => {
  const config = CATEGORY_CONFIG[category];
  const expositores = EXHIBITORS_DATA.filter(e => e.category === category);
  return (
    <View style={s.expositorWrapper}>
      <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.75}>
        <Ionicons name="arrow-back" size={15} color={C.primary} />
        <Text style={s.backBtnText}>Volver a categorías</Text>
      </TouchableOpacity>
      <Text style={s.sectionLabel}>{config?.label || category}</Text>
      {expositores.map(exp => (
        <TouchableOpacity key={exp.id} style={s.expositorItem} onPress={() => onSelectExpositor(exp)} activeOpacity={0.75}>
          <View style={s.expositorItemLeft}>
            <Text style={s.expositorItemName}>{exp.name}</Text>
            {exp.description && (
              <Text style={s.expositorItemDesc} numberOfLines={1}>{exp.description}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={15} color={C.textSub} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── MessageBubble ────────────────────────────────────────────────────────────

const MessageBubble = ({ message, onFeedback }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[s.bubbleWrapper, isUser ? s.bubbleWrapperUser : s.bubbleWrapperBot]}>
      {!isUser && (
        <View style={s.botAvatar}>
          <Image
            source={require('../../assets/images/logo_agronea_2026_2.png')}
            style={s.botAvatarLogo}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleBot]}>
        <Text style={[s.bubbleText, isUser ? s.bubbleTextUser : s.bubbleTextBot]}>
          {message.text}
        </Text>
        {!isUser && message.id !== 'welcome' && message.logId && (
          <View style={s.feedbackRow}>
            <TouchableOpacity
              style={[s.feedbackBtn, message.feedback === 'up' && s.feedbackBtnActive]}
              onPress={() => onFeedback(message.id, message.logId, true)}
              disabled={message.feedback !== null}
            >
              <Ionicons
                name={message.feedback === 'up' ? 'thumbs-up' : 'thumbs-up-outline'}
                size={12}
                color={message.feedback === 'up' ? C.primary : C.textSub}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.feedbackBtn, message.feedback === 'down' && s.feedbackBtnActive]}
              onPress={() => onFeedback(message.id, message.logId, false)}
              disabled={message.feedback !== null}
            >
              <Ionicons
                name={message.feedback === 'down' ? 'thumbs-down' : 'thumbs-down-outline'}
                size={12}
                color={message.feedback === 'down' ? C.error : C.textSub}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── DisambiguationBubble ─────────────────────────────────────────────────────

const DisambiguationBubble = ({ candidates, onSelect }) => (
  <View style={s.bubbleWrapperBot}>
    <View style={s.botAvatar}>
      <Image
        source={require('../../assets/images/logo_agronea_2026_2.png')}
        style={s.botAvatarLogo}
        resizeMode="contain"
      />
    </View>
    <View style={[s.bubble, s.bubbleBot, s.disambiguationBubble]}>
      <Text style={s.bubbleTextBot}>¿Te referías a alguno de estos?</Text>
      {candidates.map((c, i) => (
        <TouchableOpacity key={c.id} style={s.disambiguationOption} onPress={() => onSelect(c)} activeOpacity={0.75}>
          <View style={s.menuNumber}><Text style={s.menuNumberText}>{i + 1}</Text></View>
          <Text style={s.disambiguationOptionText}>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ─── TypingIndicator ──────────────────────────────────────────────────────────

const TypingIndicator = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 160),
        Animated.timing(d, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(d, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.delay(560),
      ]))
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);
  return (
    <View style={s.bubbleWrapperBot}>
      <View style={s.botAvatar}>
        <Image
          source={require('../../assets/images/logo_agronea_2026_2.png')}
          style={s.botAvatarLogo}
          resizeMode="contain"
        />
      </View>
      <View style={[s.bubble, s.bubbleBot, s.typingBubble]}>
        {dots.map((d, i) => (
          <Animated.View
            key={i}
            style={[s.typingDot, {
              transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
            }]}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Mensaje de bienvenida ────────────────────────────────────────────────────

const makeWelcomeMessage = () => ({
  id: 'welcome',
  role: 'assistant',
  text: '¡Hola! Soy el asistente de Agronea 2026\nEcosistema de Oportunidades 🌾\n¿Sobre qué querés consultar?',
  logId: null, feedback: null, relatedFaqs: null, showMenu: true,
});

// ─── ChatScreen ───────────────────────────────────────────────────────────────

const ChatScreen = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages]                   = useState([makeWelcomeMessage()]);
  const [inputText, setInputText]                 = useState('');
  const [isLoading, setIsLoading]                 = useState(false);
  const [eventData, setEventData]                 = useState(null);
  const [remainingQueries, setRemainingQueries]   = useState(null);
  const [pendingDisambiguation, setPendingDisambiguation] = useState(null);
  const [basicMode, setBasicMode]                 = useState(false);
  const [activeTab, setActiveTab]                 = useState('visitante');
  const [expositorFlow, setExpositorFlow]         = useState(null);
  const flatListRef = useRef(null);

  const loadEventData = useCallback(async () => {
    // 1. Cargo la data local AL INSTANTE — el chat abre sin esperar la red
    const instant = await getEventDataInstant();
    setEventData(instant);
    setRemainingQueries(instant?.aiLimit ?? 10);

    // 2. Refresco desde el servidor EN SEGUNDO PLANO — si hay algo más nuevo,
    //    actualizo la data sin bloquear ni mostrar pantalla de carga
    refreshEventDataFromServer(instant?.version).then((fresh) => {
      if (fresh) {
        setEventData(fresh);
        setRemainingQueries(prev =>
          prev === null ? (fresh?.aiLimit ?? 10) : prev
        );
      }
    });
  }, []);

  useEffect(() => { loadEventData(); }, [loadEventData]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [messages]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setExpositorFlow(null);
    setPendingDisambiguation(null);
    const tabText = tab === 'visitante'
      ? 'Acá tenés los temas para visitantes 👇'
      : 'Acá tenés los temas para expositores 👇';
    setMessages(prev => [...prev, {
      id: `tab_${Date.now()}`,
      role: 'assistant',
      text: tabText,
      logId: null, feedback: null, relatedFaqs: null,
      showMenu: true,
      menuTab: tab,
    }]);
  };

  const addBotMessage = (text, logId = null, relatedFaqs = null) => {
    setMessages(prev => [...prev, {
      id: `bot_${Date.now()}`, role: 'assistant', text,
      logId, feedback: null, relatedFaqs,
    }]);
  };

  const handleMenuSelect = (faq) => {
    setPendingDisambiguation(null);
    if (faq.id === 'expositores_general') {
      setMessages(prev => [...prev, {
        id: `user_${Date.now()}`, role: 'user', text: faq.pregunta, logId: null, feedback: null,
      }]);
      setExpositorFlow('categories');
      return;
    }
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`, role: 'user', text: faq.pregunta, logId: null, feedback: null,
    }]);
    addBotMessage(faq.respuesta, null, faq.related || null);
  };

  const handleExpositorSelect = (expositor) => {
    setPendingDisambiguation(null);
    setExpositorFlow(null);
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`, role: 'user', text: expositor.name, logId: null, feedback: null,
    }]);
    addBotMessage(formatExpositorResponse(expositor), null, null);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading || !eventData) return;
    if (pendingDisambiguation) {
      const num = parseInt(text);
      if (!isNaN(num) && num >= 1 && num <= pendingDisambiguation.candidates.length) {
        setInputText('');
        handleExpositorSelect(pendingDisambiguation.candidates[num - 1]);
        return;
      }
      setPendingDisambiguation(null);
    }
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`, role: 'user', text, logId: null, feedback: null,
    }]);
    setInputText('');
    setIsLoading(true);
    const history = messages.filter(m => m.id !== 'welcome').slice(-6).map(m => ({
      role: m.role, content: m.text,
    }));
    const result = await sendMessage(text, history, eventData);
    setIsLoading(false);
    if (result.type === 'disambiguation') {
      setPendingDisambiguation({ candidates: result.candidates });
      return;
    }
    // basicMode solo se activa cuando se agotan las consultas
    // No lo activamos por cada respuesta sin IA (puede ser fallback puntual)
    const matchedFaq = result.matchedFaqId
      ? eventData.faqs.find(f => f.id === result.matchedFaqId)
      : null;
    addBotMessage(result.response, result.logId, matchedFaq?.related || null);
    if (result.aiUsage) {
      const remaining = Math.max(0, (eventData?.aiLimit ?? 10) - result.aiUsage.count);
      setRemainingQueries(remaining);
      if (remaining === 0) setBasicMode(true);
    }
  };

  const handleFeedback = async (messageId, logId, wasHelpful) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, feedback: wasHelpful ? 'up' : 'down' } : m
    ));
    await sendFeedback(logId, wasHelpful);
  };

  const currentMenu = activeTab === 'visitante' ? MENU_VISITANTE : MENU_EXPOSITOR;

  const renderItem = ({ item }) => {
    const itemMenu = item.menuTab
      ? (item.menuTab === 'visitante' ? MENU_VISITANTE : MENU_EXPOSITOR)
      : currentMenu;
    return (
      <View>
        <MessageBubble message={item} onFeedback={handleFeedback} />
        {(item.id === 'welcome' || item.showMenu) && eventData && (
          <MenuGrid menuItems={itemMenu} eventData={eventData} onSelect={handleMenuSelect} />
        )}
        {item.role === 'assistant' && !item.showMenu && eventData && (
          <RelatedChips
            relatedFaqs={item.relatedFaqs}
            eventData={eventData}
            onSelect={handleMenuSelect}
            onExpand={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)}
          />
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoading) return <TypingIndicator />;
    if (pendingDisambiguation) return (
      <DisambiguationBubble
        candidates={pendingDisambiguation.candidates}
        onSelect={handleExpositorSelect}
      />
    );
    if (expositorFlow === 'categories') return (
      <ExpositorCategorias onSelectCategory={setExpositorFlow} />
    );
    if (expositorFlow && expositorFlow !== 'categories') return (
      <ExpositorLista
        category={expositorFlow}
        onSelectExpositor={handleExpositorSelect}
        onBack={() => setExpositorFlow('categories')}
      />
    );
    return null;
  };

  const statusText = remainingQueries === null
    ? 'Cargando...'
    : remainingQueries > 0
      ? `${remainingQueries} consultas con IA`
      : 'Respondiendo con info guardada';

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* StatusBar oscura — íconos del sistema visibles sobre fondo blanco.
          Con SafeAreaView (edges top) el área segura ya reserva el espacio del
          status bar, así que el header queda DEBAJO de la barra de notificaciones
          y no tapado por ella. */}
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View style={s.headerLeft}>
            <View style={s.headerAvatar}>
              <Image
                source={require('../../assets/images/logo_agronea_2026_2.png')}
                style={s.headerLogo}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={s.headerTitle}>Asistente Agronea</Text>
              <Text style={s.headerSubtitle}>{statusText}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={s.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={C.textSub} />
          </TouchableOpacity>
        </View>
        <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      {/* Manejo del teclado — NO TOCAR sin leer esto.
          El KAV maneja AMBAS plataformas (enabled sin condición). Antes estaba
          enabled solo en iOS, confiando en el softwareKeyboardLayoutMode:"resize"
          del app.json para Android. Pero desde SDK 53 el edge-to-edge viene
          activado por defecto y rompió ese "resize" automático: Android dejó de
          empujar el contenido cuando aparece el teclado. Resultado: el input
          quedaba tapado.
          Fix: KAV activo en los dos lados.
            - iOS     -> behavior "padding" (siempre funcionó así)
            - Android -> behavior "height"  (el que anda con edge-to-edge)
          Si en algún SDK futuro Android vuelve a empujar solo, revisar acá. */}
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {basicMode ? (
          <View style={s.basicModeBar}>
            <Ionicons name="list-outline" size={16} color={C.textSub} />
            <Text style={s.basicModeText}>Tocá una opción para continuar</Text>
          </View>
        ) : (
          <View style={s.inputContainer}>
            <TextInput
              style={s.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={pendingDisambiguation ? 'Escribí 1, 2 o 3...' : '¿Tenés alguna consulta?'}
              placeholderTextColor={C.textSub}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              editable={!isLoading && !!eventData}
            />
            <TouchableOpacity
              style={[s.sendBtn, (!inputText.trim() || isLoading) && s.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading
                ? <ActivityIndicator size="small" color={C.card} />
                : <Ionicons name="send" size={16} color={C.card} />
              }
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  flex:      { flex: 1 },
  container: { flex: 1, backgroundColor: C.card },

  header: {
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 12,
    paddingTop: 8,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: C.border,
    overflow: 'hidden', padding: 4,
  },
  headerLogo:     { width: 30, height: 30 },
  headerTitle:    { fontSize: 15, fontWeight: '700', color: C.text },
  headerSubtitle: { fontSize: 11, color: C.textSub, marginTop: 1 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },

  messageList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 6 },
  bubbleWrapper:     { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 2 },
  bubbleWrapperUser: { justifyContent: 'flex-end' },
  bubbleWrapperBot:  { justifyContent: 'flex-start' },
  botAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
    alignSelf: 'flex-end', marginBottom: 2,
    overflow: 'hidden',
  },
  botAvatarLogo: { width: 20, height: 20 },
  bubble:    { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleUser: { backgroundColor: C.userBubble, borderBottomRightRadius: 4 },
  bubbleBot: {
    backgroundColor: C.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  bubbleText:     { fontSize: 14, lineHeight: 22 },
  bubbleTextUser: { color: C.card },
  bubbleTextBot:  { color: C.text },
  feedbackRow: { flexDirection: 'row', gap: 6, marginTop: 8, justifyContent: 'flex-end' },
  feedbackBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: C.bg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  feedbackBtnActive: { borderColor: C.primary, backgroundColor: C.primaryLight },

  menuGridWrapper: { marginTop: 10, marginBottom: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuGridBtn: {
    width: '47.5%', backgroundColor: C.card,
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  menuGridIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  menuGridLabel: { fontSize: 13, fontWeight: '600', color: C.text, flex: 1, lineHeight: 18 },

  chipsWrapper: { marginTop: 8, marginBottom: 4, paddingLeft: 36 },
  chipsLabel: {
    fontSize: 10, color: C.textSub, fontWeight: '700',
    letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase',
  },
  chipsScroll: { gap: 8, paddingRight: 16 },
  chip: {
    backgroundColor: C.primaryLight,
    borderRadius: 20, paddingHorizontal: 13, paddingVertical: 7,
    borderWidth: 1, borderColor: C.border,
  },
  chipText: { fontSize: 13, color: C.primary, fontWeight: '500' },
  btnVerTodos: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: 10, paddingVertical: 7, paddingHorizontal: 4,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  btnVerTodosText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  allTopicsPanel: {
    marginTop: 10, backgroundColor: C.bg,
    borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: C.border,
  },

  disambiguationBubble: { maxWidth: '85%', paddingBottom: 8 },
  disambiguationOption: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.border,
  },
  menuNumber: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  menuNumberText: { fontSize: 11, fontWeight: '700', color: C.card },
  disambiguationOptionText: { fontSize: 13, color: C.text, flex: 1, fontWeight: '500' },

  typingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 14, paddingHorizontal: 16,
  },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.textSub },

  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14,
    backgroundColor: C.card,
    borderTopWidth: 1, borderTopColor: C.border,
    gap: 10,
  },
  input: {
    flex: 1, backgroundColor: C.bg,
    borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: C.text,
    borderWidth: 1, borderColor: C.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: C.border },
  basicModeBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingTop: 14, paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: C.card,
    borderTopWidth: 1, borderTopColor: C.border,
  },
  basicModeText: { fontSize: 13, color: C.textSub, fontWeight: '500' },

  expositorWrapper: { marginHorizontal: 4, marginTop: 8, marginBottom: 8 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: C.textSub,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: C.border, gap: 12, marginBottom: 8,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  categoryIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.primaryLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  categoryTextWrapper: { flex: 1 },
  categoryLabel: { fontSize: 15, fontWeight: '700', color: C.text },
  categoryCount:  { fontSize: 12, color: C.textSub, marginTop: 2 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, paddingVertical: 4 },
  backBtnText: { fontSize: 13, color: C.primary, fontWeight: '600' },
  expositorItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: C.border, marginBottom: 6, gap: 10,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 2, elevation: 1,
  },
  expositorItemLeft: { flex: 1 },
  expositorItemName: { fontSize: 14, fontWeight: '700', color: C.text },
  expositorItemDesc: { fontSize: 12, color: C.textSub, marginTop: 2 },
});

export default ChatScreen;