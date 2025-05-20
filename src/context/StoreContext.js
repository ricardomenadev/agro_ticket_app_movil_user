// StoreContext.js con logs detallados
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeReducer } from '../reducer/StoreReducer';
import { initialStoreState, CART_ACTIONS, CHECKOUT_ACTIONS, PRODUCT_TYPES } from '../types/StoreTypes';
import * as apiMobile from '../api/apiMobile';

// Creación del contexto
const StoreContext = createContext(undefined);

export function StoreProvider({ children }) {
  console.log('🏗️ Inicializando StoreProvider');
  
  const [state, dispatch] = useReducer(storeReducer, initialStoreState);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Log de estado inicial
  console.log('🔄 Estado inicial:', {
    cartItems: state.cart?.items?.length || 0,
    checkoutStep: state.checkout?.currentStep || 0
  });

  // Extraer partes del estado para facilitar acceso
  const { cart, checkout } = state;

  // Función para cargar eventos
  const loadEvents = useCallback(async (forceReload = false) => {
    console.log('🔄 Ejecutando loadEvents, forceReload:', forceReload);
    console.log('📊 Eventos actuales en caché:', events.length);
    
    if (events.length > 0 && !forceReload) {
      console.log("[StoreContext] Usando eventos en caché:", events.length);
      console.log('🔍 Primer evento en caché:', events[0]?.title || 'Sin título');
      return events;
    }

    try {
      console.log('🔄 Cargando eventos frescos desde API');
      setLoading(true);
      setError(null);
      
      const eventsData = await apiMobile.fetchEvents();
      
      console.log(`✅ Datos de eventos recibidos: ${eventsData?.length || 0} eventos`);
      
      if (Array.isArray(eventsData)) {
        if (eventsData.length > 0) {
          console.log('🔍 Muestra del primer evento:', JSON.stringify(eventsData[0]).substring(0, 100) + '...');
        }
        
        setEvents(eventsData);
        return eventsData;
      } else {
        console.error('❌ Formato inesperado de eventos:', eventsData);
        setError('Formato de respuesta de eventos inesperado');
        return [];
      }
    } catch (err) {
      console.error("❌ Error en loadEvents:", err);
      setError(err.message || 'Error al cargar eventos');
      return [];
    } finally {
      setLoading(false);
    }
  }, [events.length]);

  // Función para cargar productos
  const loadProducts = useCallback(async (forceReload = false) => {
    console.log('🔄 Ejecutando loadProducts, forceReload:', forceReload);
    console.log('📊 Productos actuales en caché:', products.length);
    
    if (products.length > 0 && !forceReload) {
      console.log("[StoreContext] Usando productos en caché:", products.length);
      console.log('🔍 Primer producto en caché:', products[0]?.nombre || 'Sin nombre');
      return products;
    }

    try {
      console.log('🔄 Cargando productos frescos desde API');
      setLoading(true);
      
      const productsData = await apiMobile.fetchAllProducts();
      
      console.log(`✅ Datos de productos recibidos: ${productsData?.length || 0} productos`);
      
      if (Array.isArray(productsData)) {
        if (productsData.length > 0) {
          console.log('🔍 Muestra del primer producto:', JSON.stringify(productsData[0]).substring(0, 100) + '...');
          
          // Verificar estructura esperada
          if (!productsData[0].nombre && !productsData[0].name) {
            console.warn('⚠️ Los productos no tienen la estructura esperada (nombre/name)');
            
            // Intentar adaptar formato si es necesario
            const adaptedProducts = productsData.map(p => ({
              id: p.id,
              nombre: p.nombre || p.name || 'Producto sin nombre',
              descripcion: p.descripcion || p.description || '',
              precio: p.precio || p.price || 0,
              // Otros campos...
            }));
            
            console.log('🔄 Productos adaptados a formato esperado');
            setProducts(adaptedProducts);
            return adaptedProducts;
          }
        }
        
        setProducts(productsData);
        return productsData;
      } else {
        console.error('❌ Formato inesperado de productos:', productsData);
        return [];
      }
    } catch (err) {
      console.error("❌ Error en loadProducts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  // Cargar eventos y productos al montar el componente
  useEffect(() => {
    console.log('🔄 Efecto de carga inicial ejecutándose');
    
    const initialLoad = async () => {
      console.log('🔄 Comenzando carga inicial de datos');
      
      try {
        const eventsResult = await loadEvents();
        console.log(`✅ Carga inicial de eventos completada: ${eventsResult.length} eventos`);
        
        const productsResult = await loadProducts();
        console.log(`✅ Carga inicial de productos completada: ${productsResult.length} productos`);
      } catch (error) {
        console.error('❌ Error en carga inicial:', error);
      }
    };
    
    initialLoad();
  }, [loadEvents, loadProducts]);

  // Cargar carrito desde AsyncStorage
  useEffect(() => {
    console.log('🔄 Intentando cargar carrito desde AsyncStorage');
    
    const loadCart = async () => {
      try {
        dispatch({ type: CART_ACTIONS.FETCH_CART_REQUEST });
        
        const localCart = await AsyncStorage.getItem("cart");
        console.log('🔍 Carrito encontrado en AsyncStorage:', !!localCart);
        
        if (localCart) {
          try {
            const parsedCart = JSON.parse(localCart);
            console.log('📊 Contenido del carrito:', parsedCart?.items?.length || 0, 'items');
            
            // Asegurar que items sea un array
            const validatedCart = {
              items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
              isOpen: false // Siempre iniciar con el carrito cerrado
            };
            
            dispatch({
              type: CART_ACTIONS.FETCH_CART_SUCCESS,
              payload: validatedCart,
            });
            
            console.log(`✅ Carrito cargado: ${validatedCart.items.length} items`);
          } catch (parseError) {
            console.error("❌ Error al analizar carrito desde AsyncStorage:", parseError);
            dispatch({ 
              type: CART_ACTIONS.FETCH_CART_FAILURE,
              payload: 'Error al analizar carrito guardado'
            });
          }
        } else {
          console.log('🔄 No hay carrito guardado, inicializando vacío');
          
          // Inicializar carrito vacío
          dispatch({
            type: CART_ACTIONS.FETCH_CART_SUCCESS,
            payload: { items: [], isOpen: false },
          });
        }
      } catch (error) {
        console.error("❌ Error al cargar carrito:", error);
        dispatch({
          type: CART_ACTIONS.FETCH_CART_FAILURE,
          payload: error.toString(),
        });
      }
    };
    
    loadCart();
  }, []);

  // Función para añadir item al carrito
  const addItem = useCallback((item, cantidad = 1) => {
    console.log('🔄 Añadiendo item al carrito:', item?.nombre || item?.name || 'Item sin nombre');
    console.log('📊 Cantidad a añadir:', cantidad);
    
    try {
      dispatch({ type: CART_ACTIONS.ADD_ITEM_REQUEST });
      
      if (!item || !item.id) {
        console.error('❌ Item inválido:', item);
        throw new Error('Item inválido');
      }
      
      const tipo = item.tipo || PRODUCT_TYPES.PRODUCTO;
      console.log('📊 Tipo de item:', tipo);
      
      const isSpecialId = item.id && (
        typeof item.id === 'string' && (
          item.id.startsWith('ticket_') || 
          item.id.startsWith('parking_')
        )
      );
      console.log('📊 ¿Es ID especial?:', isSpecialId);
      
      // Construir item para añadir
      const itemToAdd = {
        id: item.id,
        nombre: item.nombre || "Producto sin nombre",
        precio: item.precio || 0,
        cantidad: cantidad,
        imagen: item.imagen || "",
        tipo: tipo,
        eventId: item.eventId || (isSpecialId ? item.id.split('_')[1] : null),
        ...(tipo === PRODUCT_TYPES.TICKET && {
          fecha: item.fecha,
          ubicacion: item.ubicacion,
          beneficios: item.beneficios
        }),
        ...(tipo === PRODUCT_TYPES.PARKING && {
          fecha: item.fecha,
          ubicacion: item.ubicacion,
          caracteristicas: item.caracteristicas
        }),
      };
      
      console.log('📊 Item preparado para añadir:', JSON.stringify(itemToAdd).substring(0, 100) + '...');
      
      // Verificar si el item ya existe y actualizar cantidad
      const updatedItems = [...(cart.items || [])];
      const existingItemIndex = updatedItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        console.log('📊 Item ya existe en carrito, actualizando cantidad');
        updatedItems[existingItemIndex].cantidad += cantidad;
      } else {
        console.log('📊 Añadiendo nuevo item al carrito');
        updatedItems.push(itemToAdd);
      }
      
      const updatedCart = { items: updatedItems, isOpen: true };
      
      // Actualizar estado
      dispatch({
        type: CART_ACTIONS.ADD_ITEM_SUCCESS,
        payload: updatedCart,
      });
      
      // Guardar en AsyncStorage
      console.log('💾 Guardando carrito actualizado en AsyncStorage');
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart))
        .then(() => console.log('✅ Carrito guardado correctamente'))
        .catch(err => console.error('❌ Error guardando carrito:', err));
      
      return true;
    } catch (error) {
      console.error("❌ Error al agregar item:", error);
      dispatch({
        type: CART_ACTIONS.ADD_ITEM_FAILURE,
        payload: error.toString(),
      });
      return false;
    }
  }, [cart.items, dispatch]);

  // Remover item del carrito
  const removeItem = useCallback((itemId) => {
    console.log('🔄 Removiendo item del carrito, ID:', itemId);
    
    try {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM_REQUEST });
      
      if (!cart.items) {
        console.error('❌ El carrito no está inicializado');
        throw new Error('El carrito no está inicializado');
      }
      
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      console.log(`📊 Items restantes después de remover: ${updatedItems.length}`);
      
      const updatedCart = { items: updatedItems, isOpen: cart.isOpen };
      
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM_SUCCESS,
        payload: updatedCart,
      });
      
      // Guardar en AsyncStorage
      console.log('💾 Guardando carrito actualizado en AsyncStorage');
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart))
        .then(() => console.log('✅ Carrito actualizado correctamente'))
        .catch(err => console.error('❌ Error guardando carrito:', err));
      
      return true;
    } catch (error) {
      console.error("❌ Error al remover item:", error);
      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM_FAILURE,
        payload: error.toString(),
      });
      return false;
    }
  }, [cart, dispatch]);

  // Actualizar cantidad de item
  const updateQuantity = useCallback((itemId, cantidad) => {
    console.log(`🔄 Actualizando cantidad de item ${itemId} a ${cantidad}`);
    
    try {
      if (cantidad <= 0) {
        console.log('📊 Cantidad <= 0, removiendo item del carrito');
        return removeItem(itemId);
      }
      
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_REQUEST });
      
      if (!cart.items) {
        console.error('❌ El carrito no está inicializado');
        throw new Error('El carrito no está inicializado');
      }
      
      // Buscar item y actualizar cantidad
      const existingItem = cart.items.find(item => item.id === itemId);
      
      if (!existingItem) {
        console.warn(`⚠️ Item ${itemId} no encontrado en el carrito`);
        dispatch({ 
          type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE,
          payload: 'Item no encontrado'
        });
        return false;
      }
      
      console.log(`📊 Actualizando cantidad de "${existingItem.nombre}" de ${existingItem.cantidad} a ${cantidad}`);
      
      const updatedItems = cart.items.map((item) =>
        item.id === itemId ? { ...item, cantidad: cantidad } : item
      );
      
      const updatedCart = { items: updatedItems, isOpen: cart.isOpen };
      
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY_SUCCESS,
        payload: updatedCart,
      });
      
      // Guardar en AsyncStorage
      console.log('💾 Guardando carrito actualizado en AsyncStorage');
      AsyncStorage.setItem("cart", JSON.stringify(updatedCart))
        .then(() => console.log('✅ Carrito actualizado correctamente'))
        .catch(err => console.error('❌ Error guardando carrito:', err));
      
      return true;
    } catch (error) {
      console.error("❌ Error al actualizar cantidad:", error);
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY_FAILURE,
        payload: error.toString(),
      });
      return false;
    }
  }, [cart, dispatch, removeItem]);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    console.log('🔄 Vaciando carrito');
    
    try {
      dispatch({ type: CART_ACTIONS.CLEAR_CART_REQUEST });
      
      const emptyCart = { items: [], isOpen: false };
      
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_SUCCESS,
        payload: emptyCart,
      });
      
      // Guardar en AsyncStorage
      console.log('💾 Guardando carrito vacío en AsyncStorage');
      AsyncStorage.setItem("cart", JSON.stringify(emptyCart))
        .then(() => console.log('✅ Carrito vacío guardado correctamente'))
        .catch(err => console.error('❌ Error guardando carrito vacío:', err));
      
      return true;
    } catch (error) {
      console.error("❌ Error al vaciar el carrito:", error);
      dispatch({
        type: CART_ACTIONS.CLEAR_CART_FAILURE,
        payload: error.toString(),
      });
      return false;
    }
  }, [dispatch]);

  // Abrir/cerrar carrito
  const toggleCart = useCallback(() => {
    console.log('🔄 Alternando visibilidad del carrito');
    
    try {
      const newIsOpen = !(cart.isOpen || false);
      console.log(`📊 Nuevo estado del carrito: ${newIsOpen ? 'abierto' : 'cerrado'}`);
      
      const updatedCart = { ...cart, isOpen: newIsOpen };
      
      dispatch({ 
        type: CART_ACTIONS.TOGGLE_CART,
        payload: updatedCart
      });
      
      // NO guardar el estado de apertura en AsyncStorage
      console.log('📝 No se guarda estado de apertura en AsyncStorage');
      
    } catch (error) {
      console.error("❌ Error al alternar carrito:", error);
    }
  }, [cart, dispatch]);

  // Establecer información del comprador
  const setBuyerInfo = useCallback((buyerData) => {
    console.log('🔄 Estableciendo información del comprador');
    console.log('📊 Datos del comprador:', buyerData);
    
    try {
      dispatch({ type: CHECKOUT_ACTIONS.SET_BUYER_INFO_REQUEST });
      
      // Verificar datos mínimos requeridos
      if (!buyerData.email) {
        console.warn('⚠️ Datos del comprador incompletos: falta email');
      }
      
      // Opcionalmente guardar en AsyncStorage
      AsyncStorage.setItem('buyerInfo', JSON.stringify(buyerData))
        .then(() => console.log('✅ Información del comprador guardada'))
        .catch(err => console.error('❌ Error guardando información del comprador:', err));
      
      dispatch({ 
        type: CHECKOUT_ACTIONS.SET_BUYER_INFO_SUCCESS, 
        payload: buyerData 
      });
      
      return true;
    } catch (error) {
      console.error("❌ Error al guardar información del comprador:", error);
      dispatch({
        type: CHECKOUT_ACTIONS.SET_BUYER_INFO_FAILURE,
        payload: error.toString()
      });
      return false;
    }
  }, [dispatch]);
  
  // Establecer paso de checkout
  const setCheckoutStep = useCallback((step) => {
    console.log(`🔄 Cambiando paso de checkout a: ${step}`);
    
    dispatch({ 
      type: CHECKOUT_ACTIONS.SET_STEP, 
      payload: step 
    });
  }, [dispatch]);

  // Establecer método de entrega
  const setDeliveryMethod = useCallback((method) => {
    console.log(`🔄 Estableciendo método de entrega: ${method}`);
    
    try {
      dispatch({ type: CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_REQUEST });
      
      dispatch({ 
        type: CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_SUCCESS, 
        payload: method 
      });
      
      // Opcionalmente guardar en AsyncStorage
      AsyncStorage.setItem('deliveryMethod', method)
        .then(() => console.log('✅ Método de entrega guardado'))
        .catch(err => console.error('❌ Error guardando método de entrega:', err));
      
      return true;
    } catch (error) {
      console.error("❌ Error al establecer método de entrega:", error);
      dispatch({
        type: CHECKOUT_ACTIONS.SET_DELIVERY_METHOD_FAILURE,
        payload: error.toString()
      });
      return false;
    }
  }, [dispatch]);

  // Calcular número total de items en el carrito
  const totalItems = useMemo(() => {
    if (!cart.items || !Array.isArray(cart.items)) return 0;
    const count = cart.items.reduce((total, item) => total + (item.cantidad || 0), 0);
    console.log(`📊 Total de items en carrito: ${count}`);
    return count;
  }, [cart.items]);

  // Calcular total del carrito
  const total = useMemo(() => {
    if (!cart.items || !Array.isArray(cart.items)) return 0;
    const sum = cart.items.reduce(
      (total, item) => total + (item.precio || 0) * (item.cantidad || 0),
      0
    );
    console.log(`📊 Total del carrito: $${sum}`);
    return sum;
  }, [cart.items]);

  // Valor del contexto
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    
    // Funciones de carrito
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,

    // Funciones de checkout
    setBuyerInfo,
    setCheckoutStep,
    setDeliveryMethod,
    
    // Datos
    products,
    events,
    loading,
    error,
    
    // Funciones para cargar datos
    loadEvents,
    loadProducts,
    
    // Cálculos
    totalItems,
    total,
    
    // Utilidades
    API_URL: apiMobile.API_URL
  }), [
    state, dispatch, 
    addItem, removeItem, updateQuantity, clearCart, toggleCart,
    setBuyerInfo, setCheckoutStep, setDeliveryMethod,
    products, events, loading, error,
    loadEvents, loadProducts,
    totalItems, total
  ]);

  console.log('✅ StoreProvider renderizado');
  
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

// Hook para usar el contexto
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    console.error('❌ useStore usado fuera de StoreProvider');
    throw new Error("useStore debe usarse dentro de un StoreProvider");
  }
  return context;
}