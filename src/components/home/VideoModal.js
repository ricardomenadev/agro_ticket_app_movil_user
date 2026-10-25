import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/theme';

const { width, height } = Dimensions.get('window');

const STORAGE_KEY = 'agronea_video_last_shown';

// ─── TESTING ────────────────────────────────────────────────────────────────
// Cambiá a true para que el modal aparezca siempre, ignorando la fecha guardada
// Acordate de volver a false antes de buildear para producción
const FORCE_SHOW = false;
// ────────────────────────────────────────────────────────────────────────────

const VideoModal = () => {
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

  useEffect(() => {
    // Espera 4 segundos antes de verificar y mostrar el modal
    const delay = setTimeout(() => {
      checkIfShouldShow();
    }, 4000);

    return () => clearTimeout(delay);
  }, []);

  const checkIfShouldShow = async () => {
    try {
      // Si FORCE_SHOW está en true, siempre muestra sin importar la fecha
      if (FORCE_SHOW) {
        show();
        return;
      }

      const lastShown = await AsyncStorage.getItem(STORAGE_KEY);
      const today = new Date().toDateString();

      if (lastShown !== today) {
        await AsyncStorage.setItem(STORAGE_KEY, today);
        show();
      }
    } catch (e) {
      console.warn('VideoModal: error al leer AsyncStorage', e);
    }
  };

  const show = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    });
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Video
          ref={videoRef}
          source={require('../../../assets/videos/agronea2026publi.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              handleClose();
            }
          }}
        />

        <View style={styles.topGradient} />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="white" />
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default VideoModal;