// storeTypes.js

// Tipos de productos
export const PRODUCT_TYPES = {
  TICKET: "ticket",
  PARKING: "parking",
  PRODUCTO: "producto",
};

// Acciones del carrito
export const CART_ACTIONS = {
  FETCH_CART_REQUEST: "FETCH_CART_REQUEST",
  FETCH_CART_SUCCESS: "FETCH_CART_SUCCESS",
  FETCH_CART_FAILURE: "FETCH_CART_FAILURE",

  ADD_ITEM_REQUEST: "ADD_ITEM_REQUEST",
  ADD_ITEM_SUCCESS: "ADD_ITEM_SUCCESS",
  ADD_ITEM_FAILURE: "ADD_ITEM_FAILURE",

  REMOVE_ITEM_REQUEST: "REMOVE_ITEM_REQUEST",
  REMOVE_ITEM_SUCCESS: "REMOVE_ITEM_SUCCESS",
  REMOVE_ITEM_FAILURE: "REMOVE_ITEM_FAILURE",

  UPDATE_QUANTITY_REQUEST: "UPDATE_QUANTITY_REQUEST",
  UPDATE_QUANTITY_SUCCESS: "UPDATE_QUANTITY_SUCCESS",
  UPDATE_QUANTITY_FAILURE: "UPDATE_QUANTITY_FAILURE",

  CLEAR_CART_REQUEST: "CLEAR_CART_REQUEST",
  CLEAR_CART_SUCCESS: "CLEAR_CART_SUCCESS",
  CLEAR_CART_FAILURE: "CLEAR_CART_FAILURE",

  TOGGLE_CART: "TOGGLE_CART",
};

// Acciones del checkout
export const CHECKOUT_ACTIONS = {
  SET_BUYER_INFO_REQUEST: "SET_BUYER_INFO_REQUEST",
  SET_BUYER_INFO_SUCCESS: "SET_BUYER_INFO_SUCCESS",
  SET_BUYER_INFO_FAILURE: "SET_BUYER_INFO_FAILURE",

  SET_DELIVERY_METHOD_REQUEST: "SET_DELIVERY_METHOD_REQUEST",
  SET_DELIVERY_METHOD_SUCCESS: "SET_DELIVERY_METHOD_SUCCESS",
  SET_DELIVERY_METHOD_FAILURE: "SET_DELIVERY_METHOD_FAILURE",

  SET_PAYMENT_METHOD_REQUEST: "SET_PAYMENT_METHOD_REQUEST",
  SET_PAYMENT_METHOD_SUCCESS: "SET_PAYMENT_METHOD_SUCCESS",
  SET_PAYMENT_METHOD_FAILURE: "SET_PAYMENT_METHOD_FAILURE",

  SET_PAYMENT_ID: "SET_PAYMENT_ID",
  SET_ORDER_ID: "SET_ORDER_ID",
  SET_STEP: "SET_STEP",
};

// Estado inicial para el reducer
export const initialStoreState = {
  cart: {
    items: [],
    isOpen: false,
    loading: false,
    error: null,
  },
  checkout: {
    currentStep: 0,
    buyerInfo: null,
    deliveryMethod: "email",
    paymentMethod: null,
    paymentId: null,
    orderId: null,
    loading: false,
    error: null,
  },
};

// Endpoints de la API
export const API_ENDPOINTS = {
  EVENTS: "/store/events",
  EVENT_BY_ID: (id) => `/store/events/${id}`,
  PRODUCTS: "/store/products",
  PRODUCT_BY_ID: (id) => `/store/products/${id}`,
  PRODUCT_CATEGORIES: "/store/categories",
  BUYER_INFO: "/store/checkout/buyer",
  DELIVERY_METHOD: "/store/checkout/delivery",
  PAYMENT_METHOD: "/store/checkout/payment",
  PROCESS_ORDER: "/store/orders",
  ORDER_BY_ID: (id) => `/store/orders/${id}`,
  PAYMENT_STATUS_BY_PAYMENT_ID: (id) => `/store/payments/${id}/status`,
  MERCADOPAGO_PREFERENCE: "/payments/mercadopago/preference",
  PROCESS_CARD_PAYMENT: "/payments/mercadopago/card",
  MERCADOPAGO_STATUS: (id) => `/payments/mercadopago/status/${id}`,
  CHECK_PAYMENT_STATUS: (id) => `/payments/status/${id}`,
  MERCADOPAGO_STATUS: (id) => `/payments/mercadopago/status/${id}`,
  MERCADOPAGO_QR: "/payments/mercadopago/qr",
  PROCESS_CARD_PAYMENT: "/payments/mercadopago/card",
  RESEND_TICKETS: (orderId) => `/store/orders/${orderId}/resend-tickets`,
  DOWNLOAD_TICKETS: (orderId) => `/store/orders/${orderId}/tickets/download`,
};
