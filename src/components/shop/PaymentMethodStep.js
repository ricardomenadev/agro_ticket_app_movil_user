import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { 
  CreditCard, 
  BanknoteIcon, 
  ArrowLeft, 
  Copy, 
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  AlertTriangle,
  Info
} from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import * as apiMobile from "../../api/apiMobile";

const PaymentMethodStep = ({
  paymentMethod,
  setPaymentMethod,
  onSubmit,
  onBack,
  isProcessing,
  buyerInfo,
  cartItems,
  total,
  navigation,
}) => {
  const [paymentError, setPaymentError] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [isCreatingPreference, setIsCreatingPreference] = useState(false);
  const [copiedItem, setCopiedItem] = useState('');

  // Estados para copiar datos bancarios
  const copyToClipboard = async (text, type) => {
    try {
      setCopiedItem(type);
      Alert.alert(
        "Copiado",
        `${type.toUpperCase()} copiado: ${text}`,
        [{ text: "OK" }]
      );
      setTimeout(() => setCopiedItem(''), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
      Alert.alert('Error', 'No se pudo copiar. Por favor, copia manualmente.');
    }
  };

  // Crear preferencia de MercadoPago cuando se selecciona tarjeta
  useEffect(() => {
    const createPreference = async () => {
      if (
        paymentMethod === "CARD" &&
        !preferenceId &&
        cartItems &&
        cartItems.length > 0
      ) {
        try {
          setPaymentError(null);
          setIsCreatingPreference(true);

          console.log("🔶 MOBILE: Creando preferencia MercadoPago...");

          // Preparar datos para la preferencia
          const preferenceData = {
            items: cartItems.map((item) => ({
              id: item.id,
              sku: item.sku,
              nombre: item.nombre || item.name,
              descripcion: item.descripcion || item.description || "",
              precio: parseFloat(item.precio || item.price || 0),
              cantidad: parseInt(item.cantidad || item.quantity || 1),
              tipo: item.tipo || "producto",
            })),
            buyerInfo: buyerInfo,
          };

          // 🔍 DEBUG: Verificar tipos de datos antes de enviar
          console.log("🔍 PREFERENCIA: Verificando tipos de datos:");
          preferenceData.items.forEach((item, index) => {
            console.log(`Item ${index + 1}:`, {
              precio: item.precio,
              tipoPrecio: typeof item.precio,
              cantidad: item.cantidad,
              tipoCantidad: typeof item.cantidad,
            });
          });

          const result = await apiMobile.createMercadoPagoPreference(
            preferenceData
          );

          if (result && result.preferenceId) {
            console.log("🔶 MOBILE: Preferencia creada:", result.preferenceId);
            setPreferenceId(result.preferenceId);
          } else {
            console.error("🔴 MOBILE: Error creando preferencia:", result);
            setPaymentError("No se pudo crear la preferencia de pago");
          }
        } catch (error) {
          console.error("🔴 MOBILE: Error creando preferencia:", error);
          setPaymentError(
            "Error al conectar con el servicio de pago: " + error.message
          );
        } finally {
          setIsCreatingPreference(false);
        }
      }
    };

    createPreference();
  }, [paymentMethod, cartItems, buyerInfo, preferenceId]);

  // Manejar pago con tarjeta (MercadoPago WebView)
  const handleCardPayment = async () => {
    if (!preferenceId) {
      Alert.alert("Error", "No se pudo crear la preferencia de pago.");
      return;
    }

    try {
      console.log("🔶 MOBILE: Abriendo MercadoPago en navegador...");
      
      // URL de MercadoPago  
      const url = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
      
      // Abrir en navegador del sistema
      await Linking.openURL(url);
      
      // Mensaje al usuario
      Alert.alert(
        "Completá tu pago", 
        "Te redirigimos al navegador. Cuando termines, volvé a la app.",
        [{ text: "OK" }]
      );
      
    } catch (error) {
      console.error("Error:", error);
      setPaymentError("No se pudo abrir el pago");
    }
  };

  // Manejar pago por transferencia
  const handleTransferPayment = async () => {
    try {
      setPaymentError(null);
      console.log("🔶 MOBILE: Procesando pago por transferencia...");

      // Payment ID temporal (igual que web)
      const paymentTimestamp = Date.now();
      const tempPaymentId = `TRANSFER-${paymentTimestamp}`;

      // ✅ PREPARAR DATOS EXACTAMENTE COMO LOS ESPERA createTransferOrder
      const transferOrderData = {
        items: cartItems.map((item) => ({
          id: item.id,
          nombre: item.nombre || item.name,
          precio: parseFloat(item.precio || item.price || 0),
          cantidad: parseInt(item.cantidad || item.quantity || 1),
          tipo: item.tipo || "producto",
          eventId: item.eventId || null,
          eventTitle: item.eventTitle || null,
          fecha: item.fecha || item.date,
          ubicacion: item.ubicacion || item.location,
        })),
        buyerInfo: buyerInfo,
        deliveryMethod: "email",
        paymentMethod: "TRANSFER", // ✅ AQUÍ ESTÁ LA CLAVE!
        total: total,
        paymentId: tempPaymentId,
      };

      console.log("🔶 MOBILE: Datos preparados:", {
        paymentId: tempPaymentId,
        items: transferOrderData.items.length,
        total: transferOrderData.total,
        paymentMethod: transferOrderData.paymentMethod // ✅ Esto debe ser "TRANSFER"
      });

      // ✅ LLAMAR DIRECTAMENTE A createTransferOrder CON LOS DATOS CORRECTOS
      const response = await apiMobile.createTransferOrder(transferOrderData);

      console.log("✅ MOBILE: ¡Transferencia procesada exitosamente!");

      // ✅ PASAR RESPUESTA EXITOSA AL COMPONENTE PADRE
      onSubmit({
        success: true,
        paymentId: tempPaymentId,
        orderData: response,
        paymentMethod: "TRANSFER"
      });

    } catch (error) {
      console.error("❌ MOBILE: Error en transferencia:", error);
      
      // Mostrar error al usuario
      setPaymentError(error.message);
      
      Alert.alert(
        "Error de Pago",
        error.message || "No se pudo procesar el pago. Intenta nuevamente.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}
      nestedScrollEnabled={true}
    >
      <Text style={styles.stepTitle}>Método de Pago</Text>

      {/* Selector de método de pago */}
      <View style={styles.paymentMethodSelector}>
        <TouchableOpacity
          style={[
            styles.methodOption,
            paymentMethod === "CARD" ? styles.selectedMethodOption : {},
          ]}
          onPress={() => setPaymentMethod("CARD")}
        >
          <CreditCard
            size={24}
            color={
              paymentMethod === "CARD" ? COLORS.primary : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === "CARD" ? styles.selectedMethodText : {},
            ]}
          >
            Tarjeta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodOption,
            paymentMethod === "TRANSFER" ? styles.selectedMethodOption : {},
          ]}
          onPress={() => setPaymentMethod("TRANSFER")}
        >
          <BanknoteIcon
            size={24}
            color={
              paymentMethod === "TRANSFER"
                ? COLORS.primary
                : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === "TRANSFER" ? styles.selectedMethodText : {},
            ]}
          >
            Transferencia
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar errores de pago si existen */}
      {paymentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{paymentError}</Text>
        </View>
      )}

      {/* Contenido específico según el método de pago seleccionado */}
      <View style={styles.paymentContent}>
        {paymentMethod === "CARD" && (
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Pago con Tarjeta</Text>

            {isCreatingPreference && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  Preparando formulario de pago...
                </Text>
              </View>
            )}

            {!isCreatingPreference && preferenceId && (
              <>
                <Text style={styles.cardInfo}>
                  Serás redirigido a un formulario seguro para completar tu pago
                  con tarjeta de crédito o débito.
                </Text>

                <View style={styles.cardFeatures}>
                  <Text style={styles.cardFeatureTitle}>
                    ✅ Características:
                  </Text>
                  <Text style={styles.cardFeature}>• Pago 100% seguro</Text>
                  <Text style={styles.cardFeature}>
                    • Hasta 12 cuotas sin interés
                  </Text>
                  <Text style={styles.cardFeature}>
                    • Todas las tarjetas aceptadas
                  </Text>
                  <Text style={styles.cardFeature}>
                    • Procesamiento inmediato
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={handleCardPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.cardButtonText}>
                      Continuar con Tarjeta
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {!isCreatingPreference && !preferenceId && (
              <View style={styles.cardErrorContainer}>
                <Text style={styles.cardErrorText}>
                  No se pudo preparar el formulario de pago. Intenta seleccionar
                  la opción nuevamente.
                </Text>
              </View>
            )}
          </View>
        )}

        {paymentMethod === "TRANSFER" && (
          <View style={styles.transferContainer}>
            {/* ✅ NUEVO: Header mejorado para transferencias */}
            <View style={styles.transferHeader}>
              <View style={styles.transferIcon}>
                <Clock size={20} color="#FFD700" />
              </View>
              <View style={styles.transferHeaderText}>
                <Text style={styles.transferTitle}>Transferencia Bancaria</Text>
                <Text style={styles.transferSubtitle}>Proceso simple y seguro</Text>
              </View>
            </View>

            {/* ✅ NUEVO: Mensaje introductorio */}
            <View style={styles.introMessage}>
              <Info size={16} color={COLORS.primary} />
              <Text style={styles.introText}>
                Una vez que confirmes, te daremos todos los pasos para completar tu pago
              </Text>
            </View>

            {/* ✅ MEJORADO: Datos bancarios con mejor diseño */}
            <View style={styles.bankInfoBox}>
              <Text style={styles.bankInfoTitle}>💳 Datos Bancarios</Text>
              
              <View style={styles.bankDataGrid}>
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>Banco:</Text>
                  <Text style={styles.bankDataValue}>Banco Nación Argentina</Text>
                </View>
                
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>Titular:</Text>
                  <Text style={styles.bankDataValue}>AGRONEA PRODUCCIONES S.R.L.</Text>
                </View>
                
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>CUIT:</Text>
                  <Text style={styles.bankDataValue}>30-71212976-6</Text>
                </View>
                
                {/* CBU con botón de copiar */}
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>CBU:</Text>
                  <View style={styles.copyableContainer}>
                    <Text style={styles.bankDataValue}>110230920023000470145</Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard('110230920023000470145', 'cbu')}
                      style={[styles.copyButton, copiedItem === 'cbu' && styles.copyButtonSuccess]}
                    >
                      {copiedItem === 'cbu' ? (
                        <CheckCircle2 size={14} color="#4CAF50" />
                      ) : (
                        <Copy size={14} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Alias con botón de copiar */}
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>Alias:</Text>
                  <View style={styles.copyableContainer}>
                    <Text style={styles.bankDataValue}>PUESTO.CIPRES.PAIS</Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard('PUESTO.CIPRES.PAIS', 'alias')}
                      style={[styles.copyButton, copiedItem === 'alias' && styles.copyButtonSuccess]}
                    >
                      {copiedItem === 'alias' ? (
                        <CheckCircle2 size={14} color="#4CAF50" />
                      ) : (
                        <Copy size={14} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.bankDataItem}>
                  <Text style={styles.bankDataLabel}>Monto:</Text>
                  <Text style={[styles.bankDataValue, styles.amountValue]}>
                    ${total?.toLocaleString() || "0"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ✅ NUEVO: Pasos a seguir */}
            <View style={styles.stepsPreview}>
              <Text style={styles.stepsTitle}>Próximos pasos:</Text>
              
              <View style={styles.stepPreviewItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Confirmar orden</Text>
              </View>
              
              <View style={styles.stepPreviewItem}>
                <View style={[styles.stepNumber, styles.stepNumberGreen]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Realizar transferencia</Text>
              </View>
              
              <View style={styles.stepPreviewItem}>
                <View style={[styles.stepNumber, styles.stepNumberBlue]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Enviar comprobante</Text>
              </View>
            </View>

            {/* ✅ NUEVO: Botones de contacto rápido */}
            <View style={styles.quickContactSection}>
              <Text style={styles.quickContactTitle}>¿Necesitas ayuda?</Text>
              
              <View style={styles.quickContactButtons}>
                <TouchableOpacity
                  style={styles.emailQuickButton}
                  onPress={() => {
                    Linking.openURL("mailto:agroneacharata@gmail.com?subject=Consulta sobre transferencia - AGRONEA");
                  }}
                >
                  <Mail size={16} color="#fff" />
                  <Text style={styles.quickButtonText}>Email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.whatsappQuickButton}
                  onPress={() => {
                    Linking.openURL("https://wa.me/+5493794222011?text=Hola! Tengo una consulta sobre el pago por transferencia.");
                  }}
                >
                  <MessageCircle size={16} color="#fff" />
                  <Text style={styles.quickButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón principal */}
            <TouchableOpacity
              style={styles.transferButton}
              onPress={handleTransferPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={COLORS.text} />
              ) : (
                <Text style={styles.transferButtonText}>
                  Confirmar Pago por Transferencia
                </Text>
              )}
            </TouchableOpacity>

            {/* ✅ NUEVO: Nota importante */}
            {/* <View style={styles.importantNote}>
              <AlertTriangle size={16} color="#FFD700" />
              <Text style={styles.importantNoteText}>
                Al confirmar, recibirás instrucciones detalladas por email para completar tu pago
              </Text>
            </View> */}
          </View>
        )}
      </View>

      {/* Botón para volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        disabled={isProcessing}
      >
        <ArrowLeft size={20} color={COLORS.text} style={styles.backIcon} />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 20,
  },
  paymentMethodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  methodOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedMethodOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "10",
  },
  methodText: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedMethodText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  paymentContent: {
    marginBottom: 24,
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

  // Estilos para pago con tarjeta (sin cambios)
  cardContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  cardInfo: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 20,
  },
  cardFeatures: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  cardFeatureTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  cardFeature: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 4,
  },
  cardButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cardErrorContainer: {
    backgroundColor: "#ff000010",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cardErrorText: {
    color: "#ff0000",
    fontSize: 14,
    textAlign: "center",
  },

  // ✅ NUEVOS ESTILOS para transferencia mejorada
  transferContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  transferHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  transferIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transferHeaderText: {
    flex: 1,
  },
  transferTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  transferSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  introMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 143, 60, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10, 143, 60, 0.3)",
  },
  introText: {
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  bankInfoBox: {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  bankInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 12,
  },
  bankDataGrid: {
    gap: 10,
  },
  bankDataItem: {
    marginBottom: 8,
  },
  bankDataLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  bankDataValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "bold",
    marginTop: 2,
  },
  amountValue: {
    fontSize: 16,
    color: "#FFD700",
  },
  copyableContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  copyButton: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: "rgba(33, 150, 243, 0.2)",
  },
  copyButtonSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.3)",
  },
  stepsPreview: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  stepPreviewItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberGreen: {
    backgroundColor: "#4CAF50",
  },
  stepNumberBlue: {
    backgroundColor: "#9C27B0",
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.text,
  },
  quickContactSection: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  quickContactTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
    textAlign: "center",
  },
  quickContactButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  emailQuickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  whatsappQuickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  quickButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
  },
  transferButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  transferButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  importantNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  importantNoteText: {
    marginLeft: 8,
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: COLORS.text,
    fontWeight: "500",
    fontSize: 16,
  },
});

export default PaymentMethodStep;