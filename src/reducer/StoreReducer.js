// storeReducer.js
import { CART_ACTIONS, CHECKOUT_ACTIONS } from '../types/StoreTypes';

/**
 * Reducer para la gestión del estado de la tienda
 */
export const storeReducer = (state, action) => {
  switch (action.type) {
    // ===== ACCIONES DEL CARRITO =====
    
    // Fetch cart - solicitud
    case CART_ACTIONS.FETCH_CART_REQUEST:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: null
        }
      };
    
    // Fetch cart - éxito
    case CART_ACTIONS.FETCH_CART_SUCCESS:
      return {
        ...state,
        cart: {
          ...action.payload,
          loading: false,
          error: null
        }
      };
    
    // Fetch cart - error
    case CART_ACTIONS.FETCH_CART_FAILURE:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload
        }
      };
    
    // Añadir item - solicitud
    case CART_ACTIONS.ADD_ITEM_REQUEST:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: null
        }
      };
    
    // Añadir item - éxito
    case CART_ACTIONS.ADD_ITEM_SUCCESS:
      return {
        ...state,
        cart: {
          ...action.payload,
          loading: false,
          error: null
        }
      };
    
    // Añadir item - error
    case CART_ACTIONS.ADD_ITEM_FAILURE:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload
        }
      };
    
    // Quitar item - solicitud
    case CART_ACTIONS.REMOVE_ITEM_REQUEST:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: null
        }
      };
    
    // Quitar item - éxito
    case CART_ACTIONS.REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        cart: {
          ...action.payload,
          loading: false,
          error: null
        }
      };
    
    // Quitar item - error
    case CART_ACTIONS.REMOVE_ITEM_FAILURE:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload
        }
      };
    
    // Actualizar cantidad - solicitud
    case CART_ACTIONS.UPDATE_QUANTITY_REQUEST:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: null
        }
      };
    
    // Actualizar cantidad - éxito
    case CART_ACTIONS.UPDATE_QUANTITY_SUCCESS:
      return {
        ...state,
        cart: {
          ...action.payload,
          loading: false,
          error: null
        }
      };
    
    // Actualizar cantidad - error
    case CART_ACTIONS.UPDATE_QUANTITY_FAILURE:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload
        }
      };
    
    // Vaciar carrito - solicitud
    case CART_ACTIONS.CLEAR_CART_REQUEST:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: true,
          error: null
        }
      };
    
    // Vaciar carrito - éxito
    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...state,
        cart: {
          ...action.payload,
          loading: false,
          error: null
        }
      };
    
    // Vaciar carrito - error
    case CART_ACTIONS.CLEAR_CART_FAILURE:
      return {
        ...state,
        cart: {
          ...state.cart,
          loading: false,
          error: action.payload
        }
      };
    
    // Alternar visibilidad carrito
    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        cart: {
          ...action.payload
        }
      };
    
    // ===== ACCIONES DEL CHECKOUT =====
    
    // Establecer información del comprador - solicitud
    case CHECKOUT_ACTIONS.SET_BUYER_INFO_REQUEST:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: true,
          error: null
        }
      };
    
    // Establecer información del comprador - éxito
    case CHECKOUT_ACTIONS.SET_BUYER_INFO_SUCCESS:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          buyerInfo: action.payload,
          loading: false,
          error: null
        }
      };
    
    // Establecer información del comprador - error
    case CHECKOUT_ACTIONS.SET_BUYER_INFO_FAILURE:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: false,
          error: action.payload
        }
      };
    
    // Establecer método de entrega - solicitud
    case CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_REQUEST:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: true,
          error: null
        }
      };
    
    // Establecer método de entrega - éxito
    case CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_SUCCESS:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          deliveryMethod: action.payload,
          loading: false,
          error: null
        }
      };
    
    // Establecer método de entrega - error
    case CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_FAILURE:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: false,
          error: action.payload
        }
      };
    
    // Establecer método de pago - solicitud
    case CHECKOUT_ACTIONS.SET_PAYMENT_METHOD_REQUEST:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: true,
          error: null
        }
      };
    
    // Establecer método de pago - éxito
    case CHECKOUT_ACTIONS.SET_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          paymentMethod: action.payload,
          loading: false,
          error: null
        }
      };
    
    // Establecer método de pago - error
    case CHECKOUT_ACTIONS.SET_PAYMENT_METHOD_FAILURE:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          loading: false,
          error: action.payload
        }
      };
    
    // Establecer ID de pago
    case CHECKOUT_ACTIONS.SET_PAYMENT_ID:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          paymentId: action.payload
        }
      };
    
    // Establecer ID de orden
    case CHECKOUT_ACTIONS.SET_ORDER_ID:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          orderId: action.payload
        }
      };
    
    // Establecer paso del checkout
    case CHECKOUT_ACTIONS.SET_STEP:
      return {
        ...state,
        checkout: {
          ...state.checkout,
          currentStep: action.payload
        }
      };
    
    // Acción desconocida
    default:
      return state;
  }
};