import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base
const API_URL = 'https://api.agronea.store/api';

const API_TIMEOUT = 15000; // 15 segundos

console.log('🚀 API_URL configurada:', API_URL);

// Crear instancia base de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests (agregar token si existe)
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error obteniendo token:', error);
    }
    
    // Log para desarrollo
    if (__DEV__) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo de errores globales)
apiClient.interceptors.response.use(
  (response) => {
    // Log para desarrollo
    if (__DEV__) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    // Log para desarrollo
    if (__DEV__) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    }

    // Manejo específico de errores
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await AsyncStorage.removeItem('authToken');
      // Aquí podrías redirigir al login si fuera necesario
    }

    // Crear mensaje de error amigable
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Error de conexión';

    // Crear objeto de error estándar
    const standardError = {
      success: false,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data || null
    };

    return Promise.reject(standardError);
  }
);

// Funciones helper para tipos de requests comunes
export const apiHelper = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return { success: true, data: response.data };
    } catch (error) {
      return error;
    }
  }
};

export default apiClient;