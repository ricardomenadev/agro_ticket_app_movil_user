// src/screens/ChatScreen.js
// Chat de la app. Lo que sabe (bienvenida, botones y documentos de cada tema) se carga en el panel web
// (Chat de la app) y llega con /public/chat-data; el celular lo guarda para usarlo sin internet.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Animated, Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sendMessage, sendFeedback, getEventDataInstant, refreshEventDataFromServer, saveLead, flushPendingLeads } from '../services/chatService';
import { EMAIL_RE } from '../services/chatLocalSearch';
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

const FALLBACK_WELCOME = '¡Hola! Soy el asistente de Agronea 🌾\n¿Sobre qué querés consultar?';

// Botones del tema: los documentos marcados "Botón en el menú" en el panel
const menuFor = (eventData, tab) =>
  (eventData?.faqs || []).filter(f => f.menu && f.topic === tab);

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

const MenuGrid = ({ items, onSelect }) => {
  if (!items?.length) return null;
  return (
    <View style={s.menuGridWrapper}>
      <View style={s.menuGrid}>
        {items.map((faq) => (
          <TouchableOpacity key={faq.id} style={s.menuGridBtn} onPress={() => onSelect(faq)} activeOpacity={0.75}>
            <View style={s.menuGridIcon}>
              <Ionicons name="document-text-outline" size={18} color={C.primary} />
            </View>
            <Text style={s.menuGridLabel} numberOfLines={2}>{faq.pregunta}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ─── MoreTopics ───────────────────────────────────────────────────────────────

const MoreTopics = ({ items, onSelect, onExpand }) => {
  const [showAll, setShowAll] = useState(false);
  if (!items?.length) return null;
  return (
    <View style={s.chipsWrapper}>
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
          <MenuGrid items={items} onSelect={(faq) => { setShowAll(false); onSelect(faq); }} />
        </View>
      )}
    </View>
  );
};

// ─── LeadForm ─────────────────────────────────────────────────────────────────
// "Dejar mi mail": para avisarle cuando haya información de stands

const LeadForm = ({ onSubmit, onCancel }) => {
  const [email, setEmail]     = useState('');
  const [company, setCompany] = useState('');
  const [error, setError]     = useState(null);
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!new RegExp(`^${EMAIL_RE.source}$`).test(email.trim())) {
      setError('Revisá el mail: tiene que ser como nombre@ejemplo.com');
      return;
    }
    setSending(true);
    const result = await onSubmit({ email, company: company.trim() || undefined });
    setSending(false);
    if (!result.ok) setError(result.message || 'No pudimos guardar el mail. Probá de nuevo.');
  };

  return (
    <View style={s.leadCard}>
      <Text style={s.leadTitle}>Te avisamos cuando haya novedades</Text>
      <Text style={s.leadText}>Cómo ser expositor, precios y condiciones de los stands.</Text>
      <TextInput
        style={s.leadInput}
        value={email}
        onChangeText={(t) => { setEmail(t); setError(null); }}
        placeholder="Tu mail"
        placeholderTextColor={C.textSub}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        accessibilityLabel="Tu mail"
      />
      <TextInput
        style={s.leadInput}
        value={company}
        onChangeText={setCompany}
        placeholder="Nombre o empresa (opcional)"
        placeholderTextColor={C.textSub}
        accessibilityLabel="Nombre o empresa, opcional"
      />
      {error && <Text style={s.leadError}>{error}</Text>}
      <View style={s.leadActions}>
        <TouchableOpacity style={s.leadCancel} onPress={onCancel} activeOpacity={0.75}>
          <Text style={s.leadCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.leadSubmit, sending && s.sendBtnDisabled]} onPress={submit} disabled={sending} activeOpacity={0.8}>
          {sending
            ? <ActivityIndicator size="small" color={C.card} />
            : <Text style={s.leadSubmitText}>Guardar mi mail</Text>}
        </TouchableOpacity>
      </View>
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
// El texto sale de eventData al dibujar, así toma lo último que bajó del panel

const makeWelcomeMessage = (tab) => ({
  id: `welcome_${tab}_${Date.now()}`,
  role: 'assistant',
  welcomeTab: tab,
  logId: null, feedback: null,
});

// ─── ChatScreen ───────────────────────────────────────────────────────────────

const ChatScreen = ({ onClose }) => {
  const [messages, setMessages]                   = useState(() => [makeWelcomeMessage('visitante')]);
  const [inputText, setInputText]                 = useState('');
  const [isLoading, setIsLoading]                 = useState(false);
  const [eventData, setEventData]                 = useState(null);
  const [remainingQueries, setRemainingQueries]   = useState(null);
  const [activeTab, setActiveTab]                 = useState('visitante');
  const [leadOpen, setLeadOpen]                   = useState(false);
  const [leadSaved, setLeadSaved]                 = useState(false);
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
    // 3. Mails que quedaron guardados sin internet
    flushPendingLeads();
  }, []);

  useEffect(() => { loadEventData(); }, [loadEventData]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    }
  }, [messages]);

  const welcomeText = (tab) => eventData?.temas?.[tab]?.welcome || FALLBACK_WELCOME;
  const askEmail = !!eventData?.temas?.expositor?.askEmail && !leadSaved;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setLeadOpen(false);
    setMessages(prev => [...prev, makeWelcomeMessage(tab)]);
  };

  const addBotMessage = (text, logId = null) => {
    setMessages(prev => [...prev, {
      id: `bot_${Date.now()}`, role: 'assistant', text,
      logId, feedback: null,
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`, role: 'user', text, logId: null, feedback: null,
    }]);
  };

  const handleMenuSelect = (faq) => {
    setLeadOpen(false);
    addUserMessage(faq.pregunta);
    addBotMessage(faq.respuesta);
  };

  const handleLeadSubmit = async (lead) => {
    const result = await saveLead({ ...lead, topic: 'expositor' });
    if (result.ok) {
      setLeadOpen(false);
      setLeadSaved(true);
      addUserMessage(lead.email.trim());
      addBotMessage(result.message || '¡Listo! Guardamos tu mail. Te vamos a escribir apenas tengamos novedades 🙌');
    }
    return result;
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading || !eventData) return;
    setLeadOpen(false);
    addUserMessage(text);
    setInputText('');
    setIsLoading(true);
    const history = messages.filter(m => m.text).slice(-6).map(m => ({
      role: m.role, content: m.text,
    }));
    const result = await sendMessage(text, history, eventData, activeTab);
    setIsLoading(false);
    addBotMessage(result.response, result.logId);
    if (EMAIL_RE.test(text)) setLeadSaved(true);
    if (result.aiUsage) {
      setRemainingQueries(Math.max(0, (eventData?.aiLimit ?? 10) - result.aiUsage.count));
    }
  };

  const handleFeedback = async (messageId, logId, wasHelpful) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, feedback: wasHelpful ? 'up' : 'down' } : m
    ));
    await sendFeedback(logId, wasHelpful);
  };

  const scrollToEnd = () => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  const renderItem = ({ item }) => {
    if (item.welcomeTab) {
      return (
        <View>
          <MessageBubble message={{ ...item, text: welcomeText(item.welcomeTab) }} onFeedback={handleFeedback} />
          <MenuGrid items={menuFor(eventData, item.welcomeTab)} onSelect={handleMenuSelect} />
          {item.welcomeTab === 'expositor' && askEmail && !leadOpen && (
            <TouchableOpacity style={s.leadBtn} onPress={() => { setLeadOpen(true); scrollToEnd(); }} activeOpacity={0.8}>
              <Ionicons name="mail-outline" size={18} color={C.card} />
              <Text style={s.leadBtnText}>Dejar mi mail</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return (
      <View>
        <MessageBubble message={item} onFeedback={handleFeedback} />
        {item.role === 'assistant' && (
          <MoreTopics items={menuFor(eventData, activeTab)} onSelect={handleMenuSelect} onExpand={scrollToEnd} />
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoading) return <TypingIndicator />;
    if (leadOpen) return <LeadForm onSubmit={handleLeadSubmit} onCancel={() => setLeadOpen(false)} />;
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

        <View style={s.inputContainer}>
          <TextInput
            style={s.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={activeTab === 'expositor' ? 'Consultá o escribí tu mail' : '¿Tenés alguna consulta?'}
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

  chipsWrapper: { marginTop: 4, marginBottom: 4, paddingLeft: 36 },
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
  leadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: C.primary, borderRadius: 16,
    minHeight: 48, paddingHorizontal: 16, marginTop: 4, marginBottom: 6,
  },
  leadBtnText: { fontSize: 15, fontWeight: '700', color: C.card },
  leadCard: {
    backgroundColor: C.card, borderRadius: 18, padding: 14, marginTop: 8, marginBottom: 8,
    borderWidth: 1, borderColor: C.border, gap: 8,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 3, elevation: 1,
  },
  leadTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  leadText:  { fontSize: 13, color: C.textSub, lineHeight: 19 },
  leadInput: {
    backgroundColor: C.bg, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 14, minHeight: 46, fontSize: 15, color: C.text,
  },
  leadError: { fontSize: 13, color: C.error },
  leadActions: { flexDirection: 'row', gap: 10, marginTop: 2 },
  leadCancel: {
    flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  leadCancelText: { fontSize: 14, fontWeight: '600', color: C.textSub },
  leadSubmit: {
    flex: 2, minHeight: 46, borderRadius: 12, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  leadSubmitText: { fontSize: 15, fontWeight: '700', color: C.card },
});

export default ChatScreen;