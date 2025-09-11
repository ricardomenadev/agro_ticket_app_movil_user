import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { ArrowLeft, X } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import * as apiMobile from '../../api/apiMobile';

const MercadoPagoWebView = ({ route, navigation }) => {
  const { preferenceId, onPaymentSuccess, onPaymentError } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  // URL de MercadoPago con la preferencia
  const mercadoPagoUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

  console.log('🔶 WEBVIEW: Cargando URL:', mercadoPagoUrl);

  // Manejar cambios de navegación en el WebView
  const handleNavigationStateChange = (navState) => {
    const { url, loading } = navState;
    
    console.log('🔶 WEBVIEW: Navegación cambió:', {
      url: url,
      loading: loading,
      canGoBack: navState.canGoBack,
    });

    setCanGoBack(navState.canGoBack);
    setLoading(loading);

    // Detectar URLs de retorno (success, failure, pending)
    if (url.includes('/mobile/payment-success')) {
      console.log('🔶 WEBVIEW: Pago exitoso detectado');
      handlePaymentSuccess(url);
    } else if (url.includes('/mobile/payment-failure')) {
      console.log('🔴 WEBVIEW: Pago fallido detectado');
      handlePaymentFailure(url);
    } else if (url.includes('/mobile/payment-pending')) {
      console.log('🔶 WEBVIEW: Pago pendiente detectado');
      handlePaymentPending(url);
    }
  };

  // Extraer parámetros de la URL
  const extractUrlParams = (url) => {
    try {
      const urlObj = new URL(url);
      const params = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch (error) {
      console.error('🔴 WEBVIEW: Error extrayendo parámetros de URL:', error);
      return {};
    }
  };

  // Manejar pago exitoso
  const handlePaymentSuccess = async (url) => {
    try {
      const params = extractUrlParams(url);
      console.log('🔶 WEBVIEW: Parámetros de pago exitoso:', params);

      const { external_reference, payment_id, status } = params;

      if (external_reference) {
        // Verificar el estado del pago con el backend
        const paymentStatus = await apiMobile.checkPaymentStatus(external_reference);
        
        console.log('🔶 WEBVIEW: Estado verificado:', paymentStatus);

        // Navegar a la pantalla de confirmación
        navigation.replace('PaymentConfirmation', {
          orderId: external_reference,
          paymentMethod: 'CARD',
          paymentId: payment_id || external_reference,
          status: 'SUCCESS',
        });

        // Ejecutar callback si existe
        if (onPaymentSuccess) {
          onPaymentSuccess({
            orderId: external_reference,
            paymentId: payment_id,
            status: status,
          });
        }
      } else {
        throw new Error('No se encontró external_reference en la URL de éxito');
      }
    } catch (error) {
      console.error('🔴 WEBVIEW: Error procesando pago exitoso:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al procesar el pago exitoso. Por favor contacta a soporte.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  // Manejar pago fallido
  const handlePaymentFailure = (url) => {
    try {
      const params = extractUrlParams(url);
      console.log('🔴 WEBVIEW: Parámetros de pago fallido:', params);

      Alert.alert(
        'Pago Rechazado',
        'Tu pago no pudo ser procesado. Puedes intentar nuevamente con otra tarjeta o método de pago.',
        [
          {
            text: 'Intentar de nuevo',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => navigation.navigate('Checkout'),
          },
        ]
      );

      // Ejecutar callback de error si existe
      if (onPaymentError) {
        onPaymentError({
          error: 'payment_rejected',
          params: params,
        });
      }
    } catch (error) {
      console.error('🔴 WEBVIEW: Error procesando pago fallido:', error);
      navigation.goBack();
    }
  };

  // Manejar pago pendiente
  const handlePaymentPending = (url) => {
    try {
      const params = extractUrlParams(url);
      console.log('🔶 WEBVIEW: Parámetros de pago pendiente:', params);

      const { external_reference } = params;

      Alert.alert(
        'Pago en Proceso',
        'Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (external_reference) {
                navigation.replace('PaymentConfirmation', {
                  orderId: external_reference,
                  paymentMethod: 'CARD',
                  status: 'PENDING',
                });
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('🔴 WEBVIEW: Error procesando pago pendiente:', error);
      navigation.goBack();
    }
  };

  // Manejar errores del WebView
  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('🔴 WEBVIEW: Error del WebView:', nativeEvent);
    
    setError('Error al cargar el formulario de pago');
    setLoading(false);
  };

  // Manejar carga del WebView
  const handleLoadStart = () => {
    console.log('🔶 WEBVIEW: Iniciando carga...');
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    console.log('🔶 WEBVIEW: Carga completada');
    setLoading(false);
  };

  // Manejar botón atrás
  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      Alert.alert(
        'Cancelar Pago',
        '¿Estás seguro que quieres cancelar el pago?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Sí, cancelar',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  // Manejar botón cerrar
  const handleClose = () => {
    Alert.alert(
      'Cancelar Pago',
      '¿Estás seguro que quieres cancelar el pago?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Pago Seguro</Text>
        
        <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
          <X size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando formulario de pago...</Text>
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error al cargar</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              webViewRef.current?.reload();
            }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* WebView */}
      {!error && (
        <WebView
          ref={webViewRef}
          source={{ uri: mercadoPagoUrl }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleWebViewError}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Configuraciones de seguridad
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures={true}
          // Headers personalizados si es necesario
          injectedJavaScript={`
            // Opcional: JavaScript para mejor UX
            document.addEventListener('DOMContentLoaded', function() {
              console.log('MercadoPago WebView loaded');
            });
          `}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
});

export default MercadoPagoWebView;