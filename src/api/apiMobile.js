// apiMobile.js con logs detallados
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base

const API_URL = 'https://3eeb-181-105-226-35.ngrok-free.app/api/mobile' || 'http://localhost:5000/api/mobile';
const API_TIMEOUT = 15000; // 15 segundos

console.log('☀️ API_URL configurada:', API_URL);

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para formatear URLs de imágenes
const formatProductImage = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Extraer la base URL sin la parte /api/mobile
    const baseUrl = API_URL.split('/api/mobile')[0];
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(async (config) => {
  console.log(`🚀 Enviando solicitud a: ${config.baseURL}${config.url}`);
  console.log('📝 Método:', config.method.toUpperCase());
  console.log('📦 Datos:', config.data);
  
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Token incluido en el header');
  } else {
    console.log('⚠️ No se encontró token de autenticación');
  }
  return config;
}, (error) => {
  console.error('❌ Error en interceptor de solicitud:', error);
  return Promise.reject(error);
});

// Interceptor para logs de respuesta
apiClient.interceptors.response.use((response) => {
  console.log(`✅ Respuesta recibida de: ${response.config.url}`);
  console.log('📊 Estado:', response.status);
  console.log('📄 Cabeceras:', response.headers);
  console.log('📦 Primeros 100 caracteres de datos:', JSON.stringify(response.data).substring(0, 100) + '...');
  return response;
}, (error) => {
  console.error(`❌ Error en respuesta: ${error.message}`);
  
  if (error.response) {
    console.error('📊 Estado del error:', error.response.status);
    console.error('📦 Datos del error:', error.response.data);
  } else if (error.request) {
    console.error('📡 Error de red (sin respuesta):', error.request);
  } else {
    console.error('🔧 Error de configuración:', error.message);
  }
  
  return Promise.reject(error);
});

// Función para manejar errores
const handleApiError = (error) => {
  console.error('🔴 Manejando error de API:', error);
  
  if (error.response) {
    // Error del servidor con respuesta
    console.error('📦 Datos de error del servidor:', error.response.data);
    return {
      success: false,
      error: error.response.data.message || 'Error del servidor',
      status: error.response.status
    };
  } else if (error.request) {
    // Error sin respuesta del servidor
    console.error('📡 Detalles de error de red:', error.request);
    return {
      success: false,
      error: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      status: 0
    };
  } else {
    // Error en la configuración
    console.error('🔧 Detalles de error de configuración:', error.message);
    return {
      success: false,
      error: 'Error de configuración de la solicitud',
      status: -1
    };
  }
};

// Endpoints de la API
export const ENDPOINTS = {
  EVENTS: '/store/events',
  EVENT_BY_ID: (id) => `/store/events/${id}`,
  PRODUCTS: '/store/products',
  PRODUCT_BY_ID: (id) => `/store/products/${id}`,
  CREATE_ORDER: '/store/orders',
  ORDER_BY_ID: (id) => `/store/orders/${id}`,
  
};

export const PAYMENT_ENDPOINTS = {
  MERCADOPAGO_PREFERENCE: '/store/payments/mercadopago/preference',
  PROCESS_CARD_PAYMENT: '/store/payments/mercadopago/card',
  MERCADOPAGO_STATUS: (id) => `/store/payments/mercadopago/status/${id}`,
  CHECK_PAYMENT_STATUS: (id) => `/store/payments/status/${id}`,
};

// Obtener todos los eventos disponibles
export const fetchEvents = async () => {
  console.log('🔄 Iniciando fetchEvents');
  try {
    console.log(`📡 Solicitando GET: ${ENDPOINTS.EVENTS}`);
    const response = await apiClient.get(ENDPOINTS.EVENTS);
    
    console.log('✅ Respuesta de eventos recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && response.data.status === 'SUCCESS' && response.data.data && Array.isArray(response.data.data.events)) {
      const events = response.data.data.events;
      console.log(`🎉 Éxito en fetchEvents: ${events.length} eventos recibidos`);
      console.log('📋 Primer evento:', JSON.stringify(events[0]).substring(0, 100) + '...');
      return events;
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      
      // Intento alternativo si la estructura es diferente
      if (response.data && Array.isArray(response.data.events)) {
        console.log('🔍 Encontrada estructura alternativa de eventos');
        return response.data.events;
      }
      
      // Intento directo si la respuesta es un array
      if (response.data && Array.isArray(response.data)) {
        console.log('🔍 La respuesta es directamente un array de eventos');
        return response.data;
      }
      
      console.error('❌ No se pudo interpretar la respuesta como lista de eventos');
      return [];
    }
  } catch (error) {
    console.error('❌ Error en fetchEvents:', error);
    console.log('📡 Detalles de la petición fallida:', {
      url: `${API_URL}${ENDPOINTS.EVENTS}`,
      method: 'GET'
    });
    
    // Intento alternativo con fetch nativo
    try {
      console.log('🔄 Intentando fetch nativo como alternativa');
      const fetchResponse = await fetch(`${API_URL}${ENDPOINTS.EVENTS}`);
      const jsonData = await fetchResponse.json();
      console.log('✅ Fetch nativo exitoso:', JSON.stringify(jsonData).substring(0, 100) + '...');
      
      if (jsonData && jsonData.data && jsonData.data.events) {
        return jsonData.data.events;
      } else if (jsonData && Array.isArray(jsonData)) {
        return jsonData;
      }
      return [];
    } catch (fetchError) {
      console.error('❌ Fetch nativo también falló:', fetchError);
      return [];
    }
  }
};

// Obtener evento por ID
export const fetchEventById = async (eventId) => {
  console.log(`🔄 Iniciando fetchEventById para ID: ${eventId}`);
  try {
    console.log(`📡 Solicitando GET: ${ENDPOINTS.EVENT_BY_ID(eventId)}`);
    const response = await apiClient.get(ENDPOINTS.EVENT_BY_ID(eventId));
    
    console.log('✅ Respuesta de evento por ID recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && response.data.status === 'SUCCESS' && response.data.data && response.data.data.event) {
      const event = response.data.data.event;
      console.log(`🎉 Éxito en fetchEventById: ID=${event.id}, Título=${event.title}`);
      return event;
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      
      // Intento alternativo
      if (response.data && response.data.event) {
        console.log('🔍 Encontrada estructura alternativa de evento');
        return response.data.event;
      }
      
      // Intento directo
      if (response.data && response.data.id) {
        console.log('🔍 La respuesta es directamente un objeto de evento');
        return response.data;
      }
      
      console.error(`❌ No se pudo interpretar la respuesta como evento (ID: ${eventId})`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error en fetchEventById para ID ${eventId}:`, error);
    return null;
  }
};

// Obtener todos los productos
export const fetchAllProducts = async () => {
  console.log('🔄 Iniciando fetchAllProducts');
  try {
    console.log(`📡 Solicitando GET: ${ENDPOINTS.PRODUCTS}`);
    const response = await apiClient.get(ENDPOINTS.PRODUCTS);
    
    console.log('✅ Respuesta de productos recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && response.data.status === 'SUCCESS' && response.data.data && Array.isArray(response.data.data.products)) {
      // Formatear productos y sus URLs de imágenes
      const products = response.data.data.products.map(product => ({
        ...product,
        imagen: formatProductImage(product.imagen || product.image)
      }));
      console.log(`🎉 Éxito en fetchAllProducts: ${products.length} productos recibidos`);
      
      if (products.length > 0) {
        console.log('📋 Primer producto:', JSON.stringify(products[0]).substring(0, 100) + '...');
        
        // Verificar estructura esperada de productos
        if (!products[0].nombre) {
          console.warn('⚠️ Los productos no tienen la estructura esperada (falta campo "nombre")');
          console.log('🔍 Campos disponibles en primer producto:', Object.keys(products[0]));
        }
      }
      
      return products;
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      
      // Intento alternativo
      if (response.data && Array.isArray(response.data.products)) {
        console.log('🔍 Encontrada estructura alternativa de productos');
        return response.data.products;
      }
      
      // Intento directo
      if (response.data && Array.isArray(response.data)) {
        console.log('🔍 La respuesta es directamente un array de productos');
        return response.data;
      }
      
      console.error('❌ No se pudo interpretar la respuesta como lista de productos');
      return [];
    }
  } catch (error) {
    console.error('❌ Error en fetchAllProducts:', error);
    return [];
  }
};

// Obtener producto por ID
export const fetchProductById = async (productId) => {
  console.log(`🔄 Iniciando fetchProductById para ID: ${productId}`);
  try {
    console.log(`📡 Solicitando GET: ${ENDPOINTS.PRODUCT_BY_ID(productId)}`);
    const response = await apiClient.get(ENDPOINTS.PRODUCT_BY_ID(productId));
    
    console.log('✅ Respuesta de producto por ID recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && response.data.status === 'SUCCESS' && response.data.data && response.data.data.product) {
      const product = response.data.data.product;
      console.log(`🎉 Éxito en fetchProductById: ID=${product.id}, Nombre=${product.nombre || product.name}`);
      return product;
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      
      // Intento alternativo
      if (response.data && response.data.product) {
        console.log('🔍 Encontrada estructura alternativa de producto');
        return response.data.product;
      }
      
      // Intento directo
      if (response.data && (response.data.id || response.data.nombre || response.data.name)) {
        console.log('🔍 La respuesta es directamente un objeto de producto');
        return response.data;
      }
      
      console.error(`❌ No se pudo interpretar la respuesta como producto (ID: ${productId})`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error en fetchProductById para ID ${productId}:`, error);
    return null;
  }
};

// Crear orden
export const createOrder = async (orderData) => {
  console.log('🔄 Iniciando createOrder');
  console.log('📦 Datos de la orden:', JSON.stringify(orderData).substring(0, 200) + '...');
  
  try {
    console.log(`📡 Solicitando POST: ${ENDPOINTS.CREATE_ORDER}`);
    const response = await apiClient.post(ENDPOINTS.CREATE_ORDER, orderData);
    
    console.log('✅ Respuesta de creación de orden recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && (response.data.status === 'SUCCESS' || response.data.success === true)) {
      const orderResult = response.data.data?.order || response.data.order;
      console.log(`🎉 Éxito en createOrder: OrderID=${orderResult?.id || orderResult?.orderNumber}`);
      return {
        success: true,
        order: orderResult
      };
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      return {
        success: false,
        error: 'Error creando la orden: Respuesta inesperada'
      };
    }
  } catch (error) {
    console.error('❌ Error en createOrder:', error);
    return handleApiError(error);
  }
};

// Verificar estado de una orden
export const checkOrderStatus = async (orderId) => {
  console.log(`🔄 Iniciando checkOrderStatus para ID: ${orderId}`);
  try {
    console.log(`📡 Solicitando GET: ${ENDPOINTS.ORDER_BY_ID(orderId)}`);
    const response = await apiClient.get(ENDPOINTS.ORDER_BY_ID(orderId));
    
    console.log('✅ Respuesta de estado de orden recibida');
    console.log('📊 Estructura de respuesta:', Object.keys(response.data));
    
    if (response.data && response.data.status === 'SUCCESS' && response.data.data && response.data.data.order) {
      const order = response.data.data.order;
      console.log(`🎉 Éxito en checkOrderStatus: OrderID=${order.id}, Status=${order.status}`);
      return {
        success: true,
        order: order
      };
    } else {
      console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      
      // Intento alternativo
      if (response.data && response.data.order) {
        console.log('🔍 Encontrada estructura alternativa de orden');
        return {
          success: true,
          order: response.data.order
        };
      }
      
      console.error(`❌ No se pudo interpretar la respuesta como orden (ID: ${orderId})`);
      return {
        success: false,
        error: 'No se encontró la orden'
      };
    }
  } catch (error) {
    console.error(`❌ Error en checkOrderStatus para ID ${orderId}:`, error);
    return handleApiError(error);
  }
};



/**
 * Crear preferencia de pago en MercadoPago
 * @param {Object} orderData - Datos de la orden incluyendo items y buyerInfo
 * @returns {Promise<Object>} - Preferencia de MercadoPago
 */
export const createMercadoPagoPreference = async (orderData) => {
    console.log('🔄 Iniciando createMercadoPagoPreference');
    console.log('📦 Datos para preferencia:', JSON.stringify(orderData).substring(0, 200) + '...');
    
    try {
      console.log(`📡 Solicitando POST: ${PAYMENT_ENDPOINTS.MERCADOPAGO_PREFERENCE}`);
      const response = await apiClient.post(PAYMENT_ENDPOINTS.MERCADOPAGO_PREFERENCE, orderData);
      
      console.log('✅ Respuesta de preferencia recibida');
      console.log('📊 Estructura de respuesta:', Object.keys(response.data));
      
      // Extraer la preferencia según formato de respuesta
      let preference = null;
      
      if (response.data && response.data.status === 'SUCCESS' && response.data.data) {
        // Formato API principal
        preference = response.data.data;
      } else if (response.data && response.data.preferenceId) {
        // Formato directo
        preference = response.data;
      } else if (response.data && response.data.id) {
        // Otro posible formato
        preference = {
          preferenceId: response.data.id,
          initPoint: response.data.init_point,
          sandboxInitPoint: response.data.sandbox_init_point
        };
      }
      
      if (preference) {
        console.log(`🎉 Éxito creando preferencia: ${preference.preferenceId}`);
        return preference;
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
        throw new Error('Formato de respuesta no reconocido');
      }
    } catch (error) {
      console.error('❌ Error creando preferencia:', error);
      return handleApiError(error);
    }
  };
  
  /**
 * Procesa un pago con tarjeta de crédito a través de MercadoPago
 * @param {Object} paymentData - Datos del pago incluyendo token, items, información del comprador
 * @returns {Promise<Object>} - Resultado del pago
 */
export const processCardPayment = async (paymentData) => {
    console.log('🔄 MOBILE-API: Iniciando processCardPayment');
    console.log('📦 MOBILE-API: Datos de pago:', JSON.stringify({
      ...paymentData,
      token: paymentData.token ? '[REDACTADO]' : undefined,
      cardNumber: '[REDACTADO]',
      itemsCount: paymentData.items?.length || 0
    }).substring(0, 300) + '...');
    
    try {
      // Verificar que tenemos todos los datos necesarios
      if (!paymentData.token) {
        throw new Error('Falta token de tarjeta');
      }
      
      if (!paymentData.items || !Array.isArray(paymentData.items) || paymentData.items.length === 0) {
        throw new Error('No hay productos en el carrito');
      }
      
      if (!paymentData.buyerInfo || !paymentData.buyerInfo.email) {
        throw new Error('Falta información del comprador');
      }
      
      // Log para verificar tipos de items ANTES de procesarlos
      console.log('📦 MOBILE-API: Verificando tipos de items recibidos:');
      paymentData.items.forEach((item, index) => {
        console.log(`Item ${index+1}: id=${item.id}, tipo=${item.tipo || 'NO-TIPO'}, eventId=${item.eventId || 'NO-EVENTID'}`);
      });
      
      // Preparar datos para el backend CON TIPOS CORREGIDOS
      const processData = {
        // Datos de tarjeta del SDK de MercadoPago
        token: paymentData.token,
        issuerId: paymentData.issuerId,
        paymentMethodId: paymentData.paymentMethodId,
        installments: paymentData.installments || 1,
        
        // Detalles de la orden
        items: paymentData.items.map(item => {
          // Detectar y corregir tipo basado en ID si no está explícito
          let tipo = item.tipo || item.type;
          
          // Detectar tipo basado en ID si no tiene tipo explícito
          if (!tipo && item.id && typeof item.id === 'string') {
            if (item.id.startsWith('ticket_')) {
              tipo = 'ticket';
              console.log(`📦 MOBILE-API: Corrigiendo tipo para item ${item.id} -> ticket`);
            } else if (item.id.startsWith('parking_')) {
              tipo = 'parking';
              console.log(`📦 MOBILE-API: Corrigiendo tipo para item ${item.id} -> parking`);
            }
          }
          
          // Extraer eventId del ID si es ticket/parking y no tiene eventId explícito
          let eventId = item.eventId;
          if (!eventId && tipo && (tipo === 'ticket' || tipo === 'parking') && item.id && typeof item.id === 'string') {
            const parts = item.id.split('_');
            if (parts.length > 1) {
              eventId = parts[1];
              console.log(`📦 MOBILE-API: Extrayendo eventId para ${item.id} -> ${eventId}`);
            }
          }
          
          return {
            id: item.id,
            nombre: item.nombre || item.name,
            descripcion: item.descripcion || item.description || '',
            precio: item.precio || item.price || 0,
            cantidad: item.cantidad || item.quantity || 1,
            tipo: tipo || 'producto',
            // Información del evento para tickets
            eventId: eventId || null,
            fecha: item.fecha || null,
            ubicacion: item.ubicacion || null,
          };
        }),
        
        // Información del comprador
        buyerInfo: paymentData.buyerInfo,
        
        // Información adicional
        deliveryMethod: paymentData.deliveryMethod || 'email',
        paymentMethod: 'CARD',
        total: parseFloat(paymentData.amount || paymentData.total || 0),
        
        // Identificación del pago
        payment_id: paymentData.payment_id || `CARD-${Date.now()}`,
        email: paymentData.buyerInfo.email,
      };
      
      // Log para verificar tipos de items DESPUÉS de procesarlos
      console.log('📦 MOBILE-API: Tipos de items después de procesar:');
      processData.items.forEach((item, index) => {
        console.log(`Item ${index+1}: id=${item.id}, tipo=${item.tipo}, eventId=${item.eventId || 'NO-EVENTID'}`);
      });
      
      console.log(`📡 MOBILE-API: Enviando solicitud POST a: ${PAYMENT_ENDPOINTS.PROCESS_CARD_PAYMENT}`);
      const response = await apiClient.post(PAYMENT_ENDPOINTS.PROCESS_CARD_PAYMENT, processData);
      console.log('📦 MOBILE-API: Datos enviados:', JSON.stringify({
        ...processData,
        token: '[REDACTADO]',
        items: processData.items.length
      }).substring(0, 200) + '...');
      console.log('✅ MOBILE-API: Respuesta de pago recibida');
      console.log('📊 MOBILE-API: Estructura de respuesta:', Object.keys(response.data));
      
      // Procesar respuesta
      if (response.data && (response.data.status === 'SUCCESS' || response.data.success === true)) {
        let paymentResult = response.data.data || response.data;
        
        console.log(`🎉 MOBILE-API: Pago procesado con éxito: Estado=${paymentResult.status || 'approved'}`);
        
        // Respuesta estandarizada
        return {
          success: true,
          ...paymentResult,
          status: paymentResult.status || 'approved',
          payment_id: paymentResult.payment_id || paymentResult.id,
          orderId: paymentResult.orderId || paymentResult.order?.id || paymentResult.order?.orderNumber,
          redirectUrl: `/public/confirmation?payment_id=${paymentResult.payment_id || paymentResult.id}`
        };
      } else {
        console.warn('⚠️ MOBILE-API: Estructura de respuesta inesperada:', JSON.stringify(response.data));
        
        // Si hay un mensaje de error específico
        if (response.data && response.data.message) {
          return {
            success: false,
            error: response.data.message,
            status: response.data.status || 'rejected'
          };
        }
        
        return {
          success: false,
          error: 'Error al procesar el pago con tarjeta',
          status: 'rejected'
        };
      }
    } catch (error) {
      console.error('❌ MOBILE-API: Error procesando pago con tarjeta:', error);
      return handleApiError(error);
    }
  };
  
  /**
   * Verificar el estado de un pago
   * @param {string} paymentId - ID del pago a verificar
   * @returns {Promise<Object>} - Estado actual del pago
   */
  export const checkPaymentStatus = async (paymentId) => {
    console.log(`🔄 Verificando estado de pago: ${paymentId}`);
    
    try {
      console.log(`📡 Solicitando GET: ${PAYMENT_ENDPOINTS.CHECK_PAYMENT_STATUS(paymentId)}`);
      const response = await apiClient.get(PAYMENT_ENDPOINTS.CHECK_PAYMENT_STATUS(paymentId));
      
      console.log('✅ Respuesta de estado de pago recibida');
      console.log('📊 Estructura de respuesta:', Object.keys(response.data));
      
      if (response.data && (response.data.status === 'SUCCESS' || response.data.success === true)) {
        let statusResult = null;
        
        if (response.data.data) {
          statusResult = response.data.data;
        } else {
          statusResult = response.data;
        }
        
        console.log(`🎉 Estado de pago: ${statusResult.status || statusResult.paymentStatus}`);
        
        return {
          success: true,
          status: statusResult.status || statusResult.paymentStatus,
          payment_id: paymentId,
          ...statusResult
        };
      } else {
        console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
        return {
          success: false,
          error: 'No se pudo determinar el estado del pago',
          payment_id: paymentId
        };
      }
    } catch (error) {
      console.error(`❌ Error verificando estado de pago ${paymentId}:`, error);
      return handleApiError(error);
    }
  };
  

export default {
  fetchEvents,
  fetchEventById,
  fetchAllProducts,
  fetchProductById,
  createOrder,
  checkOrderStatus,
  createMercadoPagoPreference,
  processCardPayment,
  checkPaymentStatus
};