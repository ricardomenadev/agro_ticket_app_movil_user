import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { CreditCard } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

// Configuración del SDK de MercadoPago - Clave pública real
const MP_PUBLIC_KEY = "TEST-bdc6d785-66fc-47e7-b731-da94d0fb0efd";

const MercadoPagoCardForm = ({
  onSubmit,
  isProcessing,
  cartTotal,
  buyerInfo,
  onError,
  items = [],
}) => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardToken, setCardToken] = useState(null);
  const [webViewKey, setWebViewKey] = useState(Date.now());
  const [debugInfo, setDebugInfo] = useState(null);

  // Referencias
  const webViewRef = useRef(null);

  // HTML para cargar el formulario de MercadoPago
  const mercadoPagoFormHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
      <title>Formulario de Pago</title>
      <script>
        // Implementar localStorage simulado ANTES de cualquier otra cosa
        // Este código debe ejecutarse antes de que cualquier otra librería intente usar localStorage
        (function() {
          try {
            // Probar si podemos acceder a localStorage
            window.localStorage.getItem('test');
          } catch (e) {
            // Si hay error, implementar localStorage simulado
            var localStorage = {
              _data: {},
              setItem: function(id, val) { this._data[id] = String(val); },
              getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : null; },
              removeItem: function(id) { delete this._data[id]; },
              clear: function() { this._data = {}; }
            };
            
            Object.defineProperty(window, 'localStorage', {
              get: function() { return localStorage; },
              configurable: true,
              enumerable: true
            });
            
            console.log('localStorage simulado implementado correctamente');
          }
          
          // Hacer lo mismo para sessionStorage
          try {
            window.sessionStorage.getItem('test');
          } catch (e) {
            var sessionStorage = {
              _data: {},
              setItem: function(id, val) { this._data[id] = String(val); },
              getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : null; },
              removeItem: function(id) { delete this._data[id]; },
              clear: function() { this._data = {}; }
            };
            
            Object.defineProperty(window, 'sessionStorage', {
              get: function() { return sessionStorage; },
              configurable: true,
              enumerable: true
            });
            
            console.log('sessionStorage simulado implementado correctamente');
          }
        })();
      </script>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 16px;
          background-color: #121212;
          color: #fff;
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .form-container {
          width: 100%;
          min-height: 100%;
          padding-bottom: 80px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          color: #e0e0e0;
          font-size: 14px;
          font-weight: 500;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .input-container {
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1e1e1e;
          padding: 10px;
          position: relative;
        }
        
        input, select {
          width: 100%;
          height: 38px;
          background-color: transparent;
          border: none;
          color: #fff;
          font-size: 16px;
          padding: 0 8px;
          box-sizing: border-box;
          outline: none;
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 16px;
        }
        
        .row {
          display: flex;
          gap: 12px;
        }
        
        .col {
          flex: 1;
        }
        
        button {
          width: 100%;
          background-color: #0A8F3C;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
        }
        
        button:hover {
          background-color: #076d2d;
        }
        
        button:disabled {
          background-color: #333;
          color: #666;
        }
        
        .error {
          color: #ff4d4d;
          font-size: 12px;
          margin-top: 4px;
        }
        
        .card-icon {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
        }
        
        .secure-info {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 16px;
        }
        
        .loading {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top: 4px solid #0A8F3C;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        #debug-info {
          margin-top: 20px;
          padding: 10px;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #1a1a1a;
          color: #00ff00;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          overflow-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div class="form-container">
        <form id="form-checkout">
          <div class="form-group">
            <label for="form-checkout__cardNumber">Número de Tarjeta</label>
            <div class="input-container">
              <input type="text" id="form-checkout__cardNumber" />
              <div class="card-icon" id="card-icon"></div>
            </div>
            <div class="error" id="error-cardNumber"></div>
          </div>
          
          <div class="form-group">
            <label for="form-checkout__cardholderName">Titular de la Tarjeta</label>
            <div class="input-container">
              <input type="text" id="form-checkout__cardholderName" value="${
                buyerInfo?.firstName || ""
              } ${buyerInfo?.lastName || ""}" />
            </div>
            <div class="error" id="error-cardholderName"></div>
          </div>
          
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="form-checkout__expirationDate">Fecha de Vencimiento</label>
                <div class="input-container">
                  <input type="text" id="form-checkout__expirationDate" placeholder="MM/YY" />
                </div>
                <div class="error" id="error-expirationDate"></div>
              </div>
            </div>
            
            <div class="col">
              <div class="form-group">
                <label for="form-checkout__securityCode">Código de Seguridad</label>
                <div class="input-container">
                  <input type="text" id="form-checkout__securityCode" />
                </div>
                <div class="error" id="error-securityCode"></div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="form-checkout__issuer">Banco Emisor</label>
            <div class="input-container">
              <select id="form-checkout__issuer"></select>
            </div>
            <div class="error" id="error-issuer"></div>
          </div>
          
          <div class="form-group">
            <label for="form-checkout__installments">Cuotas</label>
            <div class="input-container">
              <select id="form-checkout__installments"></select>
            </div>
            <div class="error" id="error-installments"></div>
          </div>
          
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="form-checkout__identificationType">Tipo de Documento</label>
                <div class="input-container">
                  <select id="form-checkout__identificationType"></select>
                </div>
                <div class="error" id="error-identificationType"></div>
              </div>
            </div>
            
            <div class="col">
              <div class="form-group">
                <label for="form-checkout__identificationNumber">Número de Documento</label>
                <div class="input-container">
                  <input type="text" id="form-checkout__identificationNumber" value="${
                    buyerInfo?.dni || ""
                  }" />
                </div>
                <div class="error" id="error-identificationNumber"></div>
              </div>
            </div>
          </div>
          
          <button type="submit" id="form-checkout__submit">Pagar $${cartTotal.toFixed(
            2
          )}</button>
          
          <p class="secure-info">Tus datos están seguros. Utilizamos encriptación de 256 bits para proteger tu información.</p>
          
          <div id="debug-info" style="display: none;"></div>
        </form>
      </div>
      
      <script src="https://sdk.mercadopago.com/js/v2"></script>
      <script>
        // Función de ayuda para debugging
        function logDebug(message, data) {
          console.log(message, data);
          const debugElement = document.getElementById('debug-info');
          if (debugElement) {
            const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
            const logMsg = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
            const line = \`[\${timestamp}] \${message}: \${logMsg}\\n\`;
            debugElement.textContent += line;
            debugElement.style.display = 'block';
          }
          
          // También notificar a React Native
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'DEBUG_LOG',
              message,
              data
            }));
          } catch (e) {
            console.error('Error enviando debug a RN:', e);
          }
        }
      
        // Inicializar MercadoPago
        logDebug('Iniciando SDK MercadoPago', '${MP_PUBLIC_KEY}');
        
        // Establecer variable global para paymentMethodId
        window.paymentMethodId = null;
        
        try {
          const mp = new MercadoPago('${MP_PUBLIC_KEY}', {
            locale: 'es-AR'
          });
          
          // Referencias a elementos DOM - Asegúrate de que existen
          const form = document.getElementById('form-checkout');
          const cardNumberElement = document.getElementById('form-checkout__cardNumber');
          const cardholderNameElement = document.getElementById('form-checkout__cardholderName');
          const expirationDateElement = document.getElementById('form-checkout__expirationDate');
          const securityCodeElement = document.getElementById('form-checkout__securityCode');
          const issuerElement = document.getElementById('form-checkout__issuer');
          const installmentsElement = document.getElementById('form-checkout__installments');
          const identificationTypeElement = document.getElementById('form-checkout__identificationType');
          const identificationNumberElement = document.getElementById('form-checkout__identificationNumber');
          const submitButton = document.getElementById('form-checkout__submit');
          const cardIconElement = document.getElementById('card-icon');
          
          // Verificar que todos los elementos existen
          if (!form || !cardNumberElement || !cardholderNameElement || !submitButton) {
            throw new Error('No se pudieron encontrar todos los elementos del formulario');
          }
          
          logDebug('Creando cardForm', 'Iniciando configuración');
          
          // Crear formulario de tarjeta
          try {
            const cardForm = mp.cardForm({
              amount: '${cartTotal.toFixed(2)}',
              iframe: false,
              form: {
                id: 'form-checkout',
                cardNumber: {
                  id: 'form-checkout__cardNumber',
                  placeholder: 'Número de tarjeta',
                },
                expirationDate: {
                  id: 'form-checkout__expirationDate',
                  placeholder: 'MM/YY',
                },
                securityCode: {
                  id: 'form-checkout__securityCode',
                  placeholder: 'Código de seguridad',
                },
                cardholderName: {
                  id: 'form-checkout__cardholderName',
                  placeholder: 'Titular de la tarjeta',
                },
                issuer: {
                  id: 'form-checkout__issuer',
                  placeholder: 'Banco emisor',
                },
                installments: {
                  id: 'form-checkout__installments',
                  placeholder: 'Cuotas',
                },
                identificationType: {
                  id: 'form-checkout__identificationType',
                  placeholder: 'Tipo de documento',
                },
                identificationNumber: {
                  id: 'form-checkout__identificationNumber',
                  placeholder: 'Número de documento',
                },
              },
              callbacks: {
                onFormMounted: error => {
                  if (error) {
                    logDebug('Error en onFormMounted', error);
                    // Notificar al componente de React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'FORM_ERROR',
                      error: error.message || 'Error al montar el formulario'
                    }));
                    return;
                  }
                  
                  logDebug('onFormMounted exitoso', 'Formulario listo');
                  
                  // Notificar que el formulario está listo
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'FORM_READY'
                  }));
                  
                  // Actualizar el ícono según tipo de tarjeta
                  if (cardNumberElement) {
                    cardNumberElement.addEventListener('keyup', () => {
                      const firstDigit = cardNumberElement.value.charAt(0);
                      let iconUrl = '';
                      
                      if (/^4/.test(cardNumberElement.value)) {
                        iconUrl = 'https://img.icons8.com/color/48/000000/visa.png';
                      } else if (/^5[1-5]/.test(cardNumberElement.value)) {
                        iconUrl = 'https://img.icons8.com/color/48/000000/mastercard.png';
                      } else if (/^3[47]/.test(cardNumberElement.value)) {
                        iconUrl = 'https://img.icons8.com/color/48/000000/amex.png';
                      }
                      
                      if (iconUrl && cardIconElement) {
                        cardIconElement.innerHTML = \`<img src="\${iconUrl}" width="24" height="24">\`;
                      } else if (cardIconElement) {
                        cardIconElement.innerHTML = '';
                      }
                    });
                  }
                },
                onIdentificationTypesReceived: (error, identificationTypes) => {
                  if (error) {
                    logDebug('Error en identificationType', error);
                  } else {
                    logDebug('Tipos de ID recibidos', identificationTypes?.length || 0);
                  }
                },
                onPaymentMethodsReceived: (error, paymentMethods) => {
                  if (error) {
                    logDebug('Error en paymentMethods', error);
                  } else if (paymentMethods && paymentMethods.length > 0) {
                    logDebug('Métodos de pago recibidos', paymentMethods[0].id || 'none');
                    
                    // Guardamos el payment method ID globalmente
                    window.paymentMethodId = paymentMethods[0].id || 'credit_card';
                  } else {
                    logDebug('No se recibieron métodos de pago', 'usando credit_card por defecto');
                    window.paymentMethodId = 'credit_card';
                  }
                },
                onIssuersReceived: (error, issuers) => {
                  if (error) {
                    logDebug('Error en issuers', error);
                  } else {
                    logDebug('Issuers recibidos', issuers?.length || 0);
                  }
                },
                onInstallmentsReceived: (error, installments) => {
                  if (error) {
                    logDebug('Error en installments', error);
                  } else {
                    logDebug('Installments recibidos', installments?.length || 0);
                  }
                },
                onCardTokenReceived: (error, token) => {
                  if (error) {
                    logDebug('Error en onCardTokenReceived', error);
                    
                    // Restablecer botón
                    if (submitButton) {
                      submitButton.disabled = false;
                      submitButton.innerHTML = 'Intentar nuevamente';
                    }
                    
                    // Mostrar error
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'TOKEN_ERROR',
                      error: error.message || 'Error al generar el token de la tarjeta'
                    }));
                    return;
                  }
                  
                  // Verificar el formato del token - soportar tanto token.id como token.token
const tokenValue = token.id || token.token;
if (!tokenValue) {
  logDebug('Token inválido o sin valor', JSON.stringify(token));
  
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'TOKEN_ERROR',
    error: 'Token inválido o mal formateado'
  }));
  return;
}

// Log explícito del token antes de enviarlo
logDebug('Token generado correctamente', tokenValue);
logDebug('Token completo recibido', JSON.stringify(token));
                  
                  
                  
                  try {
                    // Aquí enviamos el token generado al componente de React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'TOKEN_CREATED',
                      token: tokenValue, // Explícitamente incluir el tokenValue aquí
                      paymentMethodId: window.paymentMethodId || 'credit_card',
                      issuerId: issuerElement ? issuerElement.value || '1' : '1',
                      installments: installmentsElement ? installmentsElement.value || '1' : '1',
                      identificationType: identificationTypeElement ? identificationTypeElement.value || 'DNI' : 'DNI',
                      identificationNumber: identificationNumberElement ? identificationNumberElement.value || '${
                        buyerInfo?.dni || ""
                      }' : '${buyerInfo?.dni || ""}',
                      cardholderName: cardholderNameElement ? cardholderNameElement.value || '${
                        buyerInfo?.firstName || ""
                      } ${buyerInfo?.lastName || ""}' : '${
    buyerInfo?.firstName || ""
  } ${buyerInfo?.lastName || ""}',
                      cardholderEmail: '${buyerInfo?.email || ""}',
                      lastFourDigits: token.last_four_digits || ''
                    }));
                    
                    // Cambiar el texto del botón para mostrar éxito
                    if (submitButton) {
                      submitButton.innerHTML = '✓ Token Generado';
                    }
                  } catch (e) {
                    logDebug('Error enviando mensaje a React Native', e);
                    
                    // Intentar enviar un mensaje más simple como respaldo
                    try {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'TOKEN_CREATED_SIMPLE',
                        token: tokenValue
                      }));
                    } catch (simpleError) {
                      logDebug('Incluso el mensaje simple falló', simpleError);
                    }
                  }
                },
                onSubmit: async (event) => {
                  event.preventDefault();
                  
                  logDebug('onSubmit ejecutado', 'Procesando formulario');
                  
                  // Deshabilitar botón mientras se procesa
                  if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
                  }
                  
                  // Notificar al componente de React Native
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'SUBMIT_STARTED'
                  }));
                  
                  // Timeout para detectar problemas - aumentado a 15 segundos
                  setTimeout(() => {
                    if (submitButton && submitButton.disabled) {
                      logDebug('Timeout de token', 'El proceso está tardando demasiado');
                      
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'TOKEN_TIMEOUT',
                        error: 'El proceso está tardando demasiado. Verifica los datos.'
                      }));
                    }
                  }, 15000);
                  // No hacemos nada más aquí, el token se generará en onCardTokenReceived
                },
                onFetching: (resource) => {
                  logDebug('onFetching', resource);
                  
                  if (resource === 'cardToken') {
                    if (submitButton) {
                      submitButton.innerHTML = 'Procesando...';
                    }
                  }
                },
                onFormUnmounted: function() {
                  logDebug('Form unmounted', 'Formulario desmontado');
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'FORM_UNMOUNTED'
                  }));
                },
                onError: function(error) {
                  logDebug('onError general', error);
                  
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'FORM_ERROR',
                    error: error.message || 'Error en el formulario'
                  }));
                }
              }
            });
            
            logDebug('CardForm creado exitosamente', 'Listo para usar');
          } catch (cardFormError) {
            logDebug('Error creando cardForm', cardFormError);
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'FORM_ERROR',
              error: 'Error creando el formulario: ' + cardFormError.message
            }));
          }
        } catch (mpError) {
          logDebug('Error inicializando MP', mpError);
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'FORM_ERROR',
            error: 'Error inicializando MercadoPago: ' + mpError.message
          }));
        }
        
        // Manejo de errores - simplificado para evitar referencias problemáticas
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    try {
      var formElement = document.getElementById('form-checkout');
      if (formElement) {
        var inputs = formElement.getElementsByTagName('input');
        var selects = formElement.getElementsByTagName('select');
        
        function handleFocus(element) {
          if (element && element.id) {
            var parts = element.id.split('__');
            if (parts.length > 1) {
              var errorId = 'error-' + parts[1];
              var errorElement = document.getElementById(errorId);
              if (errorElement) {
                errorElement.textContent = '';
              }
            }
          }
        }
        
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].addEventListener('focus', function(event) {
            handleFocus(event.target);
          });
        }
        
        for (var j = 0; j < selects.length; j++) {
          selects[j].addEventListener('focus', function(event) {
            handleFocus(event.target);
          });
        }
      }
    } catch (e) {
      console.error('Error setting up form handlers:', e);
    }
  }, 1500);
});
        
        // Manejar errores de validación
        function showValidationError(fieldId, message) {
          const errorElement = document.getElementById(\`error-\${fieldId.split('__')[1]}\`);
          if (errorElement) {
            errorElement.textContent = message;
          }
        }
        
        // Limpiar errores cuando se cambia un campo - implementado de forma segura
        setTimeout(() => {
          try {
            const formElement = document.getElementById('form-checkout');
            if (formElement) {
              const formFields = formElement.querySelectorAll('input, select');
              formFields.forEach(field => {
                if (field) {
                  field.addEventListener('focus', () => {
                    try {
                      const fieldName = field.id.split('__')[1];
                      const errorElement = document.getElementById('error-' + fieldName);
                      if (errorElement) {
                        errorElement.textContent = '';
                      }
                    } catch (fieldError) {
                      console.error('Error en focus handler:', fieldError);
                    }
                  });
                }
              });
            } else {
              console.warn('Formulario no encontrado para agregar listeners');
            }
          } catch (formError) {
            console.error('Error al configurar event listeners:', formError);
          }
        }, 1000); // Dar tiempo para que el DOM se cargue completamente
        
        // Botón de ayuda para debugging
        function addDebugButton() {
          const debugBtn = document.createElement('button');
          debugBtn.textContent = 'Debug Form';
          debugBtn.style.marginTop = '20px';
          debugBtn.style.backgroundColor = '#333';
          debugBtn.style.color = '#fff';
          
          debugBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Recolectar datos del formulario de manera segura
            const formState = {};
            
            if (cardNumberElement) formState.cardNumber = cardNumberElement.value || 'vacío';
            if (cardholderNameElement) formState.cardholderName = cardholderNameElement.value || 'vacío';
            if (expirationDateElement) formState.expirationDate = expirationDateElement.value || 'vacío';
            if (securityCodeElement) formState.securityCode = securityCodeElement.value ? '****' : 'vacío';
            if (issuerElement) formState.issuer = issuerElement.value || 'vacío';
            if (installmentsElement) formState.installments = installmentsElement.value || 'vacío';
            if (identificationTypeElement) formState.identificationType = identificationTypeElement.value || 'vacío';
            if (identificationNumberElement) formState.identificationNumber = identificationNumberElement.value || 'vacío';
            formState.paymentMethodId = window.paymentMethodId || 'not set';
            
            logDebug('Estado actual del formulario', formState);
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'DEBUG_FORM_STATE',
              formState
            }));
          });
          
          if (form) {
            form.appendChild(debugBtn);
          }
        }
        
        if (${__DEV__ ? "true" : "false"}) {
          // Sólo agregar en desarrollo
          addDebugButton();
          
          // Mostrar elemento de debug
          const debugInfoElement = document.getElementById('debug-info');
          if (debugInfoElement) {
            debugInfoElement.style.display = 'block';
          }
        }
        
        // Notificar que la página está lista
        window.onload = function() {
          logDebug('Página cargada', 'onload ejecutado');
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PAGE_LOADED'
          }));
        };
      </script>
    </body>
    </html>
  `;

  // Ejecutar JavaScript en el WebView
  const executeJavaScript = (js) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(js);
      console.log("JavaScript inyectado en WebView");
      return true;
    } else {
      console.error("WebView ref no disponible");
      return false;
    }
  };

  // Verificar estado del formulario en caso de timeout
  useEffect(() => {
    // Si está procesando por más de 15 segundos, verificar estado
    if (isProcessing) {
      const timeout = setTimeout(() => {
        // Inyectar JavaScript para obtener estado actual
        executeJavaScript(`
          try {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'PROCESSING_TIMEOUT_CHECK',
              submitButtonState: document.getElementById('form-checkout__submit')?.innerHTML || 'no encontrado',
              formState: {
                disabled: document.getElementById('form-checkout__submit')?.disabled || false,
                cardNumber: document.getElementById('form-checkout__cardNumber')?.value || 'vacío',
                cardholderName: document.getElementById('form-checkout__cardholderName')?.value || 'vacío'
              }
            }));
          } catch(e) {
            console.error('Error verificando estado:', e);
          }
        `);
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [isProcessing]);

  // Manejar mensajes del WebView
  const handleWebViewMessage = (event) => {
    try {
      console.log("Raw message:", event.nativeEvent.data);
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Mensaje recibido del WebView:", data);

      switch (data.type) {
        case "PAGE_LOADED":
          console.log("Página de MercadoPago cargada");
          setLoading(false);
          break;

        case "FORM_READY":
          console.log("Formulario de MercadoPago listo");
          setLoading(false);
          break;

        case "SUBMIT_STARTED":
          console.log("Inicio de envío del formulario");
          break;

        case "DEBUG_LOG":
          console.log(`[WebView Log] ${data.message}:`, data.data);
          break;

        case "DEBUG_FORM_STATE":
          console.log("Estado del formulario:", data.formState);
          setDebugInfo(data.formState);
          break;

        case "UNCAUGHT_ERROR":
          console.error("Error no capturado en WebView:", data.error);
          setError(`Error no controlado: ${data.error}`);
          if (onError) {
            onError(`Error no controlado: ${data.error}`);
          }
          break;

        case "FORM_ERROR":
          console.error("Error en formulario:", data.error);
          setError(data.error);
          if (onError) {
            onError(data.error);
          }

          // Intentar restaurar el botón submit
          executeJavaScript(`
            try {
              const submitBtn = document.getElementById('form-checkout__submit');
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reintentar Pago';
              }
            } catch(e) {
              console.error('Error restaurando botón:', e);
            }
          `);
          break;

        case "TOKEN_TIMEOUT":
          console.error("Timeout generando token:", data.error);
          setError(
            data.error || "La generación del token está tardando demasiado"
          );
          if (onError) {
            onError(
              data.error || "La generación del token está tardando demasiado"
            );
          }

          // Restaurar formulario
          executeJavaScript(`
            try {
              const submitBtn = document.getElementById('form-checkout__submit');
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reintentar Pago';
              }
            } catch(e) {
              console.error('Error restaurando botón después de timeout:', e);
            }
          `);
          break;

        case "PROCESSING_TIMEOUT_CHECK":
          console.log("Verificación de timeout:", data);
          if (isProcessing) {
            Alert.alert(
              "Procesamiento prolongado",
              "El proceso está tomando más tiempo de lo esperado. ¿Deseas cancelar o continuar esperando?",
              [
                {
                  text: "Cancelar",
                  onPress: () => {
                    executeJavaScript(`
                      try {
                        const submitBtn = document.getElementById('form-checkout__submit');
                        if (submitBtn) {
                          submitBtn.disabled = false;
                          submitBtn.innerHTML = 'Reintentar Pago';
                        }
                      } catch(e) {
                        console.error('Error restaurando botón tras cancelación:', e);
                      }
                    `);
                    setError("Proceso cancelado por el usuario");
                  },
                  style: "cancel",
                },
                { text: "Continuar esperando", onPress: () => {} },
              ]
            );
          }
          break;

        case "TOKEN_CREATED":
          console.log("Token de tarjeta creado exitosamente:", data.token);

          // Verificar explícitamente que tenemos un token válido
          if (!data.token) {
            console.error("No se recibió token válido");
            setError(
              "No se pudo generar el token de pago. Intenta nuevamente."
            );
            return;
          }

          setCardToken(data);

          // Preparar datos para enviar al backend de manera más robusta
          const paymentData = {
            // Datos del token generado por MercadoPago
            token: data.token,
            paymentMethodId: data.paymentMethodId || "credit_card",
            issuerId: data.issuerId || "1",
            installments: parseInt(data.installments) || 1,
            identificationType: data.identificationType || "DNI",
            identificationNumber: data.identificationNumber || buyerInfo?.dni,

            // Datos del comprador
            buyerInfo: buyerInfo,

            // Información del pago
            lastFourDigits: data.lastFourDigits,
            cardholderName: data.cardholderName,
            email: data.cardholderEmail || buyerInfo?.email,

            // ID único para este pago
            payment_id: `CARD-${Date.now()}`,

            // Método de pago y entrega
            paymentMethod: "CARD",
            deliveryMethod: "email",

            // Monto total
            amount: cartTotal,
            total: cartTotal,

            // Items del carrito
            items: items
              ? items.map((item) => ({
                  id: item.id,
                  nombre: item.nombre || item.name,
                  descripcion: item.descripcion || item.description || "",
                  precio: item.precio || item.price || 0,
                  cantidad: item.cantidad || item.quantity || 1,
                  tipo: item.tipo || "producto",
                  // Información de eventos si corresponde
                  eventId: item.eventId || null,
                  fecha: item.fecha || null,
                  ubicacion: item.ubicacion || null,
                }))
              : [],
          };

          console.log("Enviando datos al backend:", paymentData);

          // Llamar a la función onSubmit con los datos procesados
          onSubmit(paymentData);
          break;

        case "TOKEN_CREATED_SIMPLE":
          // Alternativa simple por si falla el TOKEN_CREATED completo
          console.log("Token recibido (simple):", data.token);

          if (!data.token) {
            setError("No se pudo generar el token de pago.");
            return;
          }

          // Datos mínimos para procesar el pago
          const simplePaymentData = {
            token: data.token,
            paymentMethodId: "credit_card",
            issuerId: "1",
            installments: 1,
            identificationType: "DNI",
            identificationNumber: buyerInfo?.dni || "",
            buyerInfo: buyerInfo,
            payment_id: `CARD-${Date.now()}`,
            paymentMethod: "CARD",
            amount: cartTotal,
            total: cartTotal,
            items: items || [],
          };

          console.log("Enviando datos simplificados:", simplePaymentData);
          onSubmit(simplePaymentData);
          break;

        case "TOKEN_ERROR":
          console.error("Error generando token:", data.error);
          setError(data.error || "Error al generar el token de la tarjeta");
          if (onError) {
            onError(data.error || "Error al generar el token de la tarjeta");
          }

          // Restaurar formulario
          executeJavaScript(`
            try {
              const submitBtn = document.getElementById('form-checkout__submit');
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Reintentar Pago';
              }
            } catch(e) {
              console.error('Error restaurando botón:', e);
            }
          `);
          break;

        case "FORM_UNMOUNTED":
          console.log("Formulario desmontado");
          break;

        default:
          console.log("Mensaje no reconocido:", data);
      }
    } catch (error) {
      console.error("Error procesando mensaje del WebView:", error);
    }
  };

  // Reiniciar el WebView
  const resetWebView = () => {
    setWebViewKey(Date.now());
    setError(null);
    setCardToken(null);
    setDebugInfo(null);
  };

  // Mostrar botón de debugging en desarrollo
  const renderDebugButton = () => {
    if (__DEV__) {
      return (
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            executeJavaScript(`
             try {
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'DEBUG_FORM_STATE',
                 formState: {
                   cardNumber: document.getElementById('form-checkout__cardNumber')?.value || 'no disponible',
                   cardholderName: document.getElementById('form-checkout__cardholderName')?.value || 'no disponible',
                   submitButtonDisabled: document.getElementById('form-checkout__submit')?.disabled || false
                 }
               }));
             } catch(e) {
               console.error('Error en botón debug:', e);
             }
           `);
          }}
        >
          <Text style={styles.debugButtonText}>Debug Form</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.title}>Pago con Tarjeta</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={resetWebView}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando formulario de pago...</Text>
        </View>
      )}

      <View
        style={[
          styles.webViewContainer,
          isProcessing ? styles.disabledWebView : null,
        ]}
      >
        <WebView
          key={webViewKey}
          ref={webViewRef}
          source={{
            html: mercadoPagoFormHtml,
            baseUrl: "https://mercadopago.com/",
          }}
          onMessage={handleWebViewMessage}
          style={styles.webView}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          renderLoading={() => (
            <ActivityIndicator size="large" color={COLORS.primary} />
          )}
          onError={(error) => {
            console.error("Error en WebView:", error);
            setError("Error al cargar el formulario de pago");
          }}
          onHttpError={(error) => {
            console.error("Error HTTP en WebView:", error);
            setError(`Error HTTP (${error.statusCode}): ${error.description}`);
          }}
        />
      </View>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color={COLORS.text} />
          <Text style={styles.processingText}>Procesando pago...</Text>
        </View>
      )}

      {debugInfo && __DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugInfoTitle}>Debug Info:</Text>
          <Text style={styles.debugInfoText}>
            {JSON.stringify(debugInfo, null, 2)}
          </Text>
        </View>
      )}

      {renderDebugButton()}

      <Text style={styles.secureInfo}>
        Tus datos están seguros. Utilizamos encriptación de 256 bits para
        proteger tu información.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
    textAlign: "center",
  },
  webViewContainer: {
    height: 600,
    minHeight: 550,
    maxHeight: 800,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  disabledWebView: {
    opacity: 0.7,
    pointerEvents: "none",
  },
  webView: {
    flex: 1,
    height: "100%",
  },
  errorContainer: {
    backgroundColor: "#ff000020",
    borderWidth: 1,
    borderColor: "#ff0000",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff0000",
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.text,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  retryButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  secureInfo: {
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  processingText: {
    color: COLORS.text,
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
  },
  debugButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  debugInfo: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  debugInfoTitle: {
    color: "#00ff00",
    fontWeight: "bold",
    marginBottom: 5,
  },
  debugInfoText: {
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
  },
});

export default MercadoPagoCardForm;
