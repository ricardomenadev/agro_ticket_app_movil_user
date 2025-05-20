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
  Smartphone,
  BanknoteIcon,
  ArrowLeft,
} from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import * as MercadoPagoCheckout from "@blackbox-vision/react-native-mercadopago-px";
import MercadoPagoCardForm from "./CardForm";
import * as apiMobile from "../../api/apiMobile";

// Configuración del SDK de MercadoPago
const MP_PUBLIC_KEY =
  process.env.MERCADOPAGO_PUBLIC_KEY ||
  "TEST-bdc6d785-66fc-47e7-b731-da94d0fb0efd";

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
  const [paymentId, setPaymentId] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [mercadoPagoSdk, setMercadoPagoSdk] = useState(null);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  // Inicializar MercadoPago SDK
  const initializeMercadoPagoSDK = async () => {
    try {
      console.log("Inicializando SDK de MercadoPago...");
      // No es necesario inicializar el SDK como tal, solo marcar como inicializado
      setSdkInitialized(true);
      console.log("SDK de MercadoPago listo para usar");
    } catch (error) {
      console.error("Error inicializando SDK de MercadoPago:", error);
      setPaymentError(
        "Error al inicializar el sistema de pagos: " + error.message
      );
    }
  };

  // Efecto para crear una preferencia de MercadoPago si se selecciona ese método
  useEffect(() => {
    const createPreference = async () => {
      if (
        paymentMethod === "MERCADOPAGO" &&
        !preferenceId &&
        cartItems &&
        cartItems.length > 0
      ) {
        try {
          // Limpiar cualquier error anterior
          setPaymentError(null);

          // Crear objeto para la preferencia
          const preferenceData = {
            items: cartItems.map((item) => ({
              id: item.id,
              nombre: item.nombre || item.name,
              descripcion: item.descripcion || item.description || "",
              precio: item.precio || item.price,
              cantidad: item.cantidad || item.quantity || 1,
              tipo: item.tipo || "producto",
            })),
            buyerInfo: buyerInfo,
            total: total,
          };

          console.log("Creando preferencia de MercadoPago...");
          const result = await apiMobile.createMercadoPagoPreference(
            preferenceData
          );

          if (result && result.preferenceId) {
            console.log("Preferencia creada:", result.preferenceId);
            setPreferenceId(result.preferenceId);
          } else {
            console.error("Error creando preferencia:", result);
            setPaymentError("No se pudo crear la preferencia de pago");
          }
        } catch (error) {
          console.error("Error creando preferencia:", error);
          setPaymentError(
            "Error al conectar con el servicio de pago: " + error.message
          );
        }
      }
    };

    createPreference();
  }, [paymentMethod, cartItems, buyerInfo, total, preferenceId]);

  // Manejar el envío de datos de tarjeta
  const handleCardSubmit = async (data) => {
  try {
    setPaymentError(null);
    console.log("🔶 MOBILE: Procesando pago con tarjeta...");

    // Verificar token
    if (!data.token) {
      throw new Error("No se pudo generar el token de la tarjeta");
    }

    // Generar payment_id temporal
    const paymentTimestamp = Date.now();
    const payment_id = `CARD-${paymentTimestamp}`;
    console.log(`🔶 MOBILE: Generando payment_id temporal: ${payment_id}`);

    // Log de los items antes de procesarlos
    console.log("🔶 MOBILE: Items originales:", JSON.stringify(cartItems));

    // Preparar los items preservando toda la información necesaria y CORRIGIENDO TIPOS
    const preparedItems = cartItems.map((item) => {
      // Detectar tipo basado en ID si no está explícito
      let tipo = item.tipo || item.type;
      
      // Si no tiene tipo definido pero tiene ID que comienza con ticket_ o parking_
      if (!tipo && item.id && typeof item.id === 'string') {
        if (item.id.startsWith('ticket_')) {
          tipo = 'ticket';
          console.log(`🔶 MOBILE: Corrigiendo item ${item.id} a tipo 'ticket'`);
        } else if (item.id.startsWith('parking_')) {
          tipo = 'parking';
          console.log(`🔶 MOBILE: Corrigiendo item ${item.id} a tipo 'parking'`);
        }
      }
      
      // Si tiene eventId pero no tipo, podría ser un ticket o parking
      if (!tipo && item.eventId) {
        // Podríamos inferir tipo por otras características si es necesario
        console.log(`🔶 MOBILE: Item con eventId pero sin tipo definido: ${item.id}`);
      }
      
      return {
        id: item.id,
        nombre: item.nombre || item.name,
        descripcion: item.descripcion || item.description || item.nombre || item.name,
        precio: item.precio || item.price,
        cantidad: item.cantidad || item.quantity || 1,
        tipo: tipo || "producto", // Usar el tipo detectado o "producto" como fallback
        // Preservar información del evento
        eventId: item.eventId || (tipo === 'ticket' || tipo === 'parking' ? item.id.split('_')[1] : null),
        eventTitle: item.eventTitle || null,
        fecha: item.fecha || item.date,
        ubicacion: item.ubicacion || item.location,
        imagen: item.imagen || item.image,
      };
    });

    // Log de los items después de procesarlos
    console.log("🔶 MOBILE: Items procesados con tipos verificados:");
    preparedItems.forEach((item, index) => {
      console.log(`Item ${index+1}: id=${item.id}, tipo=${item.tipo}, eventId=${item.eventId || 'N/A'}`);
    });

    // Preparar datos para el backend
    const paymentData = {
      // Datos específicos de tarjeta
      token: data.token,
      issuerId: data.issuerId || "1",
      paymentMethodId: data.paymentMethodId || "credit_card",
      installments: data.installments || "1",
      identificationType: data.identificationType || "DNI",
      identificationNumber: data.identificationNumber || buyerInfo.dni,

      // Datos generales del pago
      items: preparedItems,
      buyerInfo: buyerInfo,
      deliveryMethod: "email", // O usar una variable si tienes selección de método de entrega
      paymentMethod: "CARD",
      total: parseFloat(total),
      payment_id: payment_id,
      email: data.cardholderEmail || buyerInfo.email,
      amount: parseFloat(total),
    };

    console.log("🔶 MOBILE: Enviando datos finales para procesamiento:", 
      JSON.stringify({
        ...paymentData,
        token: "[TOKEN REDACTADO]", // No mostrar el token completo en logs
        items: paymentData.items.length
      })
    );

    // Enviar al método de procesamiento
    onSubmit(paymentData);
    
  } catch (error) {
    console.error("🔴 MOBILE: Error en envío de tarjeta:", error);
    setPaymentError(error.message || "Error procesando el pago con tarjeta");
  }
};

  // Manejar pago con MercadoPago (abrir app o webview)
  const handleMercadoPagoPayment = async () => {
    if (!preferenceId) {
      Alert.alert(
        "Error",
        "No se pudo crear la preferencia de pago. Intenta nuevamente."
      );
      return;
    }

    try {
      setPaymentError(null);

      if (!sdkInitialized || !mercadoPagoSdk) {
        throw new Error(
          "El SDK de MercadoPago no está inicializado correctamente"
        );
      }

      console.log("Iniciando pago con MercadoPago...");

      // Configuración para el checkout de MercadoPago
      const checkoutConfig = {
        preferenceId: preferenceId,
        publicKey: MP_PUBLIC_KEY,
        language: "es-AR",
        navigationController: null, // Solo para iOS native
      };

      // Iniciar el proceso de pago con MercadoPago
      console.log("Abriendo MercadoPago...");
      // Usar el método createPayment según la documentación
      const paymentResult = await MercadoPagoCheckout.createPayment({
        publicKey: MP_PUBLIC_KEY,
        preferenceId: preferenceId,
        language: "es-AR", // Opcional
      });

      console.log("Resultado del pago con MercadoPago:", paymentResult);

      if (paymentResult) {
        // MercadoPago devuelve diferentes formatos según plataforma
        // Normalizar el resultado
        const statusMap = {
          approved: "approved",
          in_process: "pending",
          pending: "pending",
          rejected: "rejected",
          canceled: "rejected",
          null: "rejected",
        };

        const paymentStatus = statusMap[paymentResult.status] || "pending";

        // Crear un payment_id único si no lo hay
        const tempPaymentId =
          paymentResult.id ||
          `MP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        setPaymentId(tempPaymentId);

        // Preparar datos para actualizar el estado del pago en nuestro sistema
        const paymentData = {
          payment_id: tempPaymentId,
          preferenceId: preferenceId,
          items: cartItems,
          buyerInfo: buyerInfo,
          total: total,
          paymentMethod: "MERCADOPAGO",
          status: paymentStatus,
          mercadoPagoResult: paymentResult, // Incluir el resultado completo
        };

        // Solo procesamos si el pago fue exitoso o está pendiente
        if (paymentStatus === "approved" || paymentStatus === "pending") {
          console.log(`Pago ${paymentStatus}, procesando...`);
          onSubmit(paymentData);
        } else {
          // El pago fue rechazado
          console.log("Pago rechazado por MercadoPago");
          setPaymentError(
            `El pago fue rechazado: ${
              paymentResult.statusDetail || "Contacta a tu entidad emisora"
            }`
          );
        }
      } else {
        // El usuario canceló el proceso
        throw new Error("Proceso de pago cancelado");
      }
    } catch (error) {
      console.error("Error en pago con MercadoPago:", error);

      // Manejar específicamente cuando el usuario cancela
      if (
        error.message.includes("cancel") ||
        error.message.includes("Usuario cerró MercadoPago")
      ) {
        setPaymentError("Proceso de pago cancelado");
      } else {
        setPaymentError(
          "Error al procesar el pago con MercadoPago: " + error.message
        );
      }
    }
  };

  // Manejar pago por transferencia
  const handleTransferPayment = () => {
    try {
      setPaymentError(null);

      // Crear identificador temporal
      const paymentTimestamp = Date.now();
      const tempPaymentId = `TRANSFER-${paymentTimestamp}`;
      setPaymentId(tempPaymentId);

      console.log("Procesando pago por transferencia:", tempPaymentId);

      // Procesar pago por transferencia
      const paymentData = {
        // Datos generales del pago
        payment_id: tempPaymentId,
        items: cartItems.map((item) => ({
          id: item.id,
          nombre: item.nombre || item.name,
          descripcion: item.descripcion || item.description || "",
          precio: item.precio || item.price || 0,
          cantidad: item.cantidad || item.quantity || 1,
          tipo: item.tipo || "producto",
          eventId: item.eventId || null,
          fecha: item.fecha || null,
          ubicacion: item.ubicacion || null,
        })),
        buyerInfo: buyerInfo,
        total: total,
        paymentMethod: "TRANSFER",
        deliveryMethod: "email",
      };

      onSubmit(paymentData);
    } catch (error) {
      console.error("Error en pago por transferencia:", error);
      setPaymentError(
        "Error al procesar la solicitud de pago por transferencia: " +
          error.message
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
            paymentMethod === "MERCADOPAGO" ? styles.selectedMethodOption : {},
          ]}
          onPress={() => setPaymentMethod("MERCADOPAGO")}
        >
          <Smartphone
            size={24}
            color={
              paymentMethod === "MERCADOPAGO"
                ? COLORS.primary
                : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.methodText,
              paymentMethod === "MERCADOPAGO" ? styles.selectedMethodText : {},
            ]}
          >
            MercadoPago
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
          <MercadoPagoCardForm
            onSubmit={handleCardSubmit}
            onError={setPaymentError}
            isProcessing={isProcessing}
            cartTotal={total}
            buyerInfo={buyerInfo}
          />
        )}

        {paymentMethod === "MERCADOPAGO" && (
          <View style={styles.mercadoPagoContainer}>
            <Text style={styles.mercadoPagoTitle}>Pago con MercadoPago</Text>

            {!preferenceId && (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loader}
              />
            )}

            {preferenceId && (
              <>
                <Text style={styles.mercadoPagoInfo}>
                  Serás redirigido a MercadoPago para completar tu pago de forma
                  segura.
                </Text>

                <TouchableOpacity
                  style={styles.mercadoPagoButton}
                  onPress={handleMercadoPagoPayment}
                  disabled={isProcessing || !sdkInitialized}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.mercadoPagoButtonText}>
                      Pagar con MercadoPago
                    </Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.mercadoPagoSecondaryInfo}>
                  Podrás pagar con tu cuenta de MercadoPago, tarjetas guardadas
                  o escaneando un código QR.
                </Text>
              </>
            )}
          </View>
        )}

        {paymentMethod === "TRANSFER" && (
          <View style={styles.transferContainer}>
            <Text style={styles.transferTitle}>Transferencia Bancaria</Text>

            <View style={styles.bankInfoBox}>
              <Text style={styles.bankInfoTitle}>Datos Bancarios:</Text>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>Banco:</Text>
                <Text style={styles.bankInfoValue}>Banco Nación Argentina</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>Titular:</Text>
                <Text style={styles.bankInfoValue}>AGRONEA S.A.</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>CUIT:</Text>
                <Text style={styles.bankInfoValue}>30-71234567-8</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>CBU:</Text>
                <Text style={styles.bankInfoValue}>0110000000000000000000</Text>
              </View>
              <View style={styles.bankInfoRow}>
                <Text style={styles.bankInfoLabel}>Alias:</Text>
                <Text style={styles.bankInfoValue}>AGRONEA.2025.EVENTO</Text>
              </View>

              <Text style={styles.transferNote}>
                Una vez realizada la transferencia, envía el comprobante a
                pagos@agronea.com.ar indicando el número de orden que recibirás
                al confirmar.
              </Text>

              <TouchableOpacity
                style={styles.emailButton}
                onPress={() => {
                  Linking.openURL(
                    "mailto:pagos@agronea.com.ar?subject=Comprobante de pago - AGRONEA 2025"
                  );
                }}
              >
                <Text style={styles.emailButtonText}>
                  Enviar comprobante por email
                </Text>
              </TouchableOpacity>
            </View>

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

            <Text style={styles.transferSecondaryInfo}>
              Al confirmar, registraremos tu pedido como pendiente de pago hasta
              verificar la transferencia.
            </Text>
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
    padding: 12,
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
    fontSize: 12,
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
  mercadoPagoContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    alignItems: "center",
  },
  mercadoPagoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  loader: {
    marginVertical: 24,
  },
  mercadoPagoInfo: {
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.text,
  },
  mercadoPagoButton: {
    backgroundColor: "#009ee3", // Color de MercadoPago
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  mercadoPagoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mercadoPagoSecondaryInfo: {
    textAlign: "center",
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  transferContainer: {
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  transferTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  bankInfoBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  bankInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  bankInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bankInfoLabel: {
    width: 80,
    fontWeight: "bold",
    color: COLORS.text,
  },
  bankInfoValue: {
    flex: 1,
    color: COLORS.text,
  },
  transferNote: {
    marginTop: 16,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  emailButton: {
    backgroundColor: COLORS.primary + "80",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  emailButtonText: {
    color: COLORS.text,
    fontWeight: "500",
  },
  transferButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
  },
  transferButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  transferSecondaryInfo: {
    textAlign: "center",
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 12,
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
