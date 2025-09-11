// src/api/apiExpositorMobile.js
import { apiHelper } from './apiClient';

/**
 * 📱 API SERVICE PARA EXPOSITORES - APP MÓVIL
 * Todas las llamadas relacionadas con expositores públicos
 */

const expositorMobileAPI = {
  
  /**
   * 📋 OBTENER LISTA DE EXPOSITORES
   * @param {Object} params - Parámetros de consulta
   * @param {number} params.page - Página actual (default: 1)
   * @param {number} params.limit - Elementos por página (default: 20)
   * @param {string} params.search - Término de búsqueda (opcional)
   */
  getExpositores: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 20,
      ...(params.search && { search: params.search })
    }).toString();

    const response = await apiHelper.get(`/mobile/expositores?${queryParams}`);
    
    if (response.success) {
      return {
        success: true,
        expositores: response.data.data || [],
        pagination: response.data.pagination || {}
      };
    }
    
    return response;
  },

  /**
   * 👤 OBTENER PERFIL COMPLETO DE UN EXPOSITOR
   * @param {string} expositorId - ID del expositor
   */
  getExpositorProfile: async (expositorId) => {
    if (!expositorId) {
      return {
        success: false,
        message: 'ID del expositor es requerido'
      };
    }

    const response = await apiHelper.get(`/mobile/expositores/${expositorId}`);
    
    if (response.success) {
      return {
        success: true,
        expositor: response.data.profile || response.data.data || {}
      };
    }
    
    return response;
  },

  /**
   * 📦 OBTENER PRODUCTOS DE UN EXPOSITOR
   * @param {string} expositorId - ID del expositor
   */
  getExpositorProducts: async (expositorId) => {
    if (!expositorId) {
      return {
        success: false,
        message: 'ID del expositor es requerido'
      };
    }

    const response = await apiHelper.get(`/mobile/expositores/${expositorId}/productos`);
    
    if (response.success) {
      return {
        success: true,
        products: response.data.data || [],
        expositor: response.data.expositor || {}
      };
    }
    
    return response;
  },

  /**
   * 📰 OBTENER NOTICIAS DE UN EXPOSITOR
   * @param {string} expositorId - ID del expositor
   */
  getExpositorNews: async (expositorId) => {
    if (!expositorId) {
      return {
        success: false,
        message: 'ID del expositor es requerido'
      };
    }

    const response = await apiHelper.get(`/mobile/expositores/${expositorId}/noticias`);
    
    if (response.success) {
      return {
        success: true,
        news: response.data.data || [],
        expositor: response.data.expositor || {}
      };
    }
    
    return response;
  },

  /**
   * 📅 OBTENER EVENTOS DE UN EXPOSITOR
   * @param {string} expositorId - ID del expositor
   */
  getExpositorEvents: async (expositorId) => {
    if (!expositorId) {
      return {
        success: false,
        message: 'ID del expositor es requerido'
      };
    }

    const response = await apiHelper.get(`/mobile/expositores/${expositorId}/eventos`);
    
    if (response.success) {
      return {
        success: true,
        events: response.data.data || [],
        expositor: response.data.expositor || {}
      };
    }
    
    return response;
  },

  /**
   * 🗓️ OBTENER TODOS LOS EVENTOS (CALENDARIO GLOBAL)
   */
  getAllEvents: async () => {
    const response = await apiHelper.get('/mobile/expositores/eventos/all');
    
    if (response.success) {
      return {
        success: true,
        events: response.data.data || []
      };
    }
    
    return response;
  },

  /**
   * 🔍 BÚSQUEDA GENERAL DE EXPOSITORES
   * @param {string} searchTerm - Término de búsqueda
   * @param {number} limit - Límite de resultados (default: 10)
   */
  searchExpositores: async (searchTerm, limit = 10) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return {
        success: false,
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      };
    }

    return await expositorMobileAPI.getExpositores({
      search: searchTerm.trim(),
      limit,
      page: 1
    });
  }
};

export default expositorMobileAPI;