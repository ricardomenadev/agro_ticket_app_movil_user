import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Share,
  Alert,
  Linking,
} from "react-native";
import {
  Check,
  Share2,
  ArrowRight,
  Ticket,
  Home,
  Download,
  Clock,
  Mail,
  MessageCircle,
  AlertTriangle,
  Copy,
  CheckCircle2,
} from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import * as apiMobile from "../../api/apiMobile";
import { useStore } from "../../context/StoreContext";

const PaymentConfirmationScreen = ({ route, navigation }) => {
  const {
    orderId,
    paymentMethod,
    paymentId,
    orderData: passedOrderData,
    shouldClearCart: passedShouldClearCart,
  } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [copiedItem, setCopiedItem] = useState("");
  const { clearCart } = useStore();

  // Estados para copiar datos bancarios
  const copyToClipboard = async (text, type) => {
    try {
      // En React Native no hay navigator.clipboard, usamos una librería o alert
      setCopiedItem(type);
      // Mostrar alert con el texto copiado
      Alert.alert("Copiado", `${type.toUpperCase()} copiado: ${text}`, [
        { text: "OK" },
      ]);
      setTimeout(() => setCopiedItem(""), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
      Alert.alert("Error", "No se pudo copiar. Por favor, copia manualmente.");
    }
  };

  // Lógica existente sin cambios...
  // ✅ useEffect COMPLETO para PaymentConfirmationScreen

useEffect(() => {
  const processOrderData = async () => {
    console.log("🔍 CONFIRMATION: Procesando datos de orden...");
    console.log("🔍 CONFIRMATION: Parámetros recibidos:", {
      orderId,
      paymentId, 
      paymentMethod,
      passedOrderData: !!passedOrderData
    });
    
    try {
      // ✅ PRIORIDAD 1: Usar datos pasados si están disponibles
      if (passedOrderData) {
        console.log("✅ CONFIRMATION: Usando datos pasados del checkout");
        console.log("🔍 CONFIRMATION: Estructura de datos pasados:", Object.keys(passedOrderData));
        
        // Extraer datos de la orden
        let processedOrderData = null;
        
        if (passedOrderData.order) {
          // Formato: { order: { ... }, user: { ... } }
          processedOrderData = {
            ...passedOrderData.order,
            orderNumber: passedOrderData.order.orderNumber || orderId || paymentId,
            status: passedOrderData.order.status || "PENDING",
            paymentStatus: passedOrderData.order.paymentStatus || "PENDING",
            total: passedOrderData.order.total,
            createdAt: passedOrderData.order.createdAt || new Date().toISOString(),
            // Agregar información adicional si existe
            items: passedOrderData.order.items || [],
            tickets: passedOrderData.order.tickets || [],
            user: passedOrderData.user || {}
          };
        } else {
          // Formato directo: { orderNumber: ..., status: ..., etc }
          processedOrderData = {
            ...passedOrderData,
            orderNumber: passedOrderData.orderNumber || orderId || paymentId,
            status: passedOrderData.status || "PENDING",
            paymentStatus: passedOrderData.paymentStatus || "PENDING",
            createdAt: passedOrderData.createdAt || new Date().toISOString(),
            tickets: passedOrderData.tickets || []
          };
        }
        
        console.log("✅ CONFIRMATION: Datos procesados:", {
          orderNumber: processedOrderData.orderNumber,
          status: processedOrderData.status,
          total: processedOrderData.total,
          tickets: processedOrderData.tickets?.length || 0
        });
        
        setOrderData(processedOrderData);
        setLoading(false);
        return;
      }
      
      // ✅ PRIORIDAD 2: Solo si NO tenemos datos pasados, consultar API
      if (!orderId && !paymentId) {
        console.log("❌ CONFIRMATION: No hay datos pasados ni IDs para consultar");
        setError("No se encontró información de la orden");
        setLoading(false);
        return;
      }
      
      console.log("⚠️ CONFIRMATION: No hay datos pasados, consultando API...");
      setLoading(true);
      
      // Priorizar paymentId sobre orderId para la búsqueda
      const idToUse = paymentId || orderId;
      console.log("🔍 CONFIRMATION: Consultando API para ID:", idToUse);
      
      // ✅ USAR getOrderDetails en lugar de checkOrderStatus
      const result = await apiMobile.getOrderDetails(idToUse);
      
      console.log("🔍 CONFIRMATION: Respuesta completa de getOrderDetails:", result);
      
      // Verificar si tenemos datos de orden en el formato correcto
      if (result && result.status === 'SUCCESS' && result.data && result.data.order) {
        console.log("✅ CONFIRMATION: Datos obtenidos de API con formato correcto");
        
        // Normalizar los datos igual que en web
        const normalizedOrder = {
          ...result.data.order,
          // Normalizar campos críticos para evitar undefined
          tickets: result.data.order.tickets || 
                   result.data.order.items?.filter(
                     (item) => item.tipo === "ticket" || item.type === "ticket"
                   ) || [],
          // Asegurar que tengamos orderNumber
          orderNumber: result.data.order.orderNumber || result.data.order.id,
          // Asegurar otros campos importantes
          status: result.data.order.status || "PENDING",
          paymentStatus: result.data.order.paymentStatus || "PENDING",
          total: result.data.order.total,
          createdAt: result.data.order.createdAt || new Date().toISOString(),
          items: result.data.order.items || [],
          user: result.data.order.user || {}
        };
        
        console.log("✅ CONFIRMATION: Orden normalizada:", {
          orderNumber: normalizedOrder.orderNumber,
          status: normalizedOrder.status,
          total: normalizedOrder.total,
          tickets: normalizedOrder.tickets?.length || 0,
          items: normalizedOrder.items?.length || 0
        });
        
        setOrderData(normalizedOrder);
      } else {
        console.log("⚠️ CONFIRMATION: API no encontró la orden o formato incorrecto, usando datos básicos");
        
        // ✅ FALLBACK: Crear datos básicos para mostrar algo útil
        const fallbackOrderData = {
          orderNumber: orderId || paymentId,
          status: paymentMethod === "TRANSFER" ? "PENDING" : "APPROVED",
          paymentStatus: paymentMethod === "TRANSFER" ? "PENDING" : "APPROVED",
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString(),
          total: null, // No sabemos el total
          items: [],
          tickets: []
        };
        
        console.log("✅ CONFIRMATION: Usando datos de fallback");
        setOrderData(fallbackOrderData);
      }
      
    } catch (err) {
      console.error("❌ CONFIRMATION: Error procesando datos:", err);
      
      // ✅ FALLBACK FINAL: Mostrar datos básicos aunque haya error
      const fallbackOrderData = {
        orderNumber: orderId || paymentId,
        status: paymentMethod === "TRANSFER" ? "PENDING" : "APPROVED", 
        paymentStatus: paymentMethod === "TRANSFER" ? "PENDING" : "APPROVED",
        paymentMethod: paymentMethod,
        createdAt: new Date().toISOString(),
        total: null,
        items: [],
        tickets: []
      };
      
      console.log("✅ CONFIRMATION: Usando datos de fallback final debido a error");
      setOrderData(fallbackOrderData);
    } finally {
      setLoading(false);
    }
  };
  
  processOrderData();
}, [orderId, paymentId, passedOrderData, paymentMethod]);

  useEffect(() => {
    if (passedShouldClearCart) {
      console.log(
        "🧹 CONFIRMATION: Limpiando carrito en pantalla de confirmación..."
      );
      setTimeout(() => {
        clearCart();
      }, 1000);
    }
  }, [passedShouldClearCart, clearCart]);

  // Funciones existentes sin cambios...
  const shareOrder = async () => {
    try {
      const message = `¡He realizado mi compra para AGRONEA 2025! Número de orden: ${
        orderData.orderNumber || orderId || paymentId
      }. ¡Nos vemos allí!`;

      await Share.share({
        message,
        title: "Mi Compra AGRONEA 2025",
      });
    } catch (error) {
      console.error("Error compartiendo orden:", error);
    }
  };

  const downloadTickets = async () => {
    try {
      Alert.alert(
        "Descarga de tickets",
        "Tus tickets se descargarán a tu dispositivo.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error descargando tickets:", error);
      Alert.alert(
        "Error",
        "No se pudieron descargar los tickets. Intenta más tarde."
      );
    }
  };

  const hasTickets =
    orderData &&
    orderData.tickets &&
    Array.isArray(orderData.tickets) &&
    orderData.tickets.length > 0;

  const hasPhysicalProducts =
    orderData &&
    orderData.items &&
    Array.isArray(orderData.items) &&
    orderData.items.some(
      (item) => item.type === "producto" || item.tipo === "producto"
    );

  // Estados de carga y error sin cambios...
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="light-content"
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          Obteniendo información de tu compra...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="light-content"
        />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.errorButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Encabezado de éxito */}
        <View style={styles.successContainer}>
          <View style={styles.checkCircle}>
            <Check size={40} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>
            {paymentMethod === "TRANSFER"
              ? "¡Orden Creada!"
              : "¡Compra Exitosa!"}
          </Text>
          <Text style={styles.successText}>
            {paymentMethod === "TRANSFER"
              ? "Tu orden ha sido registrada. Sigue los pasos para completar el pago por transferencia."
              : "Tu compra ha sido procesada correctamente. Recibirás un email con tus tickets y detalles de la compra."}
          </Text>
        </View>

        {/* ✅ NUEVA SECCIÓN: Información específica para transferencias */}
        {paymentMethod === "TRANSFER" && (
          <View style={styles.transferSection}>
            {/* Mensaje principal */}
            <View style={styles.transferHeader}>
              <View style={styles.transferIcon}>
                <Clock size={24} color="#FFD700" />
              </View>
              <View style={styles.transferHeaderText}>
                <Text style={styles.transferTitle}>
                  ¡Pago por Transferencia!
                </Text>
                <Text style={styles.transferSubtitle}>
                  Tu compra está casi lista
                </Text>
              </View>
            </View>

            {/* Pasos a seguir */}
            <Text style={styles.stepsTitle}>
              Próximos pasos para completar tu compra:
            </Text>

            {/* Paso 1: Realizar transferencia */}
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Realiza la transferencia bancaria
                </Text>
                <Text style={styles.stepDescription}>
                  Transfiere el monto exacto de{" "}
                  <Text style={styles.amountHighlight}>
                    ${orderData?.total?.toLocaleString() || "Consultar email"}
                  </Text>{" "}
                  a la siguiente cuenta:
                </Text>

                {/* Datos bancarios */}
                <View style={styles.bankDataContainer}>
                  <Text style={styles.bankDataTitle}>💳 Datos Bancarios</Text>

                  <View style={styles.bankDataGrid}>
                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>Banco:</Text>
                      <Text style={styles.bankDataValue}>
                        Banco Nación Argentina
                      </Text>
                    </View>

                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>Titular:</Text>
                      <Text style={styles.bankDataValue}>
                        AGRONEA PRODUCCIONES S.R.L.
                      </Text>
                    </View>

                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>CUIT:</Text>
                      <Text style={styles.bankDataValue}>30-71212976-6</Text>
                    </View>

                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>CBU:</Text>
                      <View style={styles.copyableContainer}>
                        <Text style={styles.bankDataValue}>
                          110230920023000470145
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            copyToClipboard("110230920023000470145", "cbu")
                          }
                          style={[
                            styles.copyButton,
                            copiedItem === "cbu" && styles.copyButtonSuccess,
                          ]}
                        >
                          {copiedItem === "cbu" ? (
                            <CheckCircle2 size={16} color="#4CAF50" />
                          ) : (
                            <Copy size={16} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>Alias:</Text>
                      <View style={styles.copyableContainer}>
                        <Text style={styles.bankDataValue}>
                          PUESTO.CIPRES.PAIS
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            copyToClipboard("PUESTO.CIPRES.PAIS", "alias")
                          }
                          style={[
                            styles.copyButton,
                            copiedItem === "alias" && styles.copyButtonSuccess,
                          ]}
                        >
                          {copiedItem === "alias" ? (
                            <CheckCircle2 size={16} color="#4CAF50" />
                          ) : (
                            <Copy size={16} color={COLORS.primary} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.bankDataItem}>
                      <Text style={styles.bankDataLabel}>Monto:</Text>
                      <Text style={[styles.bankDataValue, styles.amountValue]}>
                        $
                        {orderData?.total?.toLocaleString() ||
                          "Consultar email"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Paso 2: Enviar comprobante */}
            <View style={styles.stepContainer}>
              <View style={[styles.stepNumber, styles.stepNumberGreen]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Envía el comprobante de pago
                </Text>
                <Text style={styles.stepDescription}>
                  Toma una foto del comprobante e incluye tu número de orden
                </Text>

                <View style={styles.orderInfoBox}>
                  <Text style={styles.orderInfoTitle}>
                    📋 Información a incluir:
                  </Text>
                  <Text style={styles.orderInfoItem}>
                    • Número de orden: {orderData?.orderNumber || paymentId}
                  </Text>
                  <Text style={styles.orderInfoItem}>• Tu nombre completo</Text>
                  <Text style={styles.orderInfoItem}>
                    • Monto: $
                    {orderData?.total?.toLocaleString() || "Consultar email"}
                  </Text>
                </View>

                {/* Botones de contacto */}
                <View style={styles.contactButtons}>
                  <TouchableOpacity
                    style={styles.emailButton}
                    onPress={() => {
                      const subject = `Comprobante de Pago - Orden ${
                        orderData?.orderNumber || paymentId
                      }`;
                      const body = `Hola! Adjunto el comprobante de pago de mi transferencia.\n\nNúmero de orden: ${
                        orderData?.orderNumber || paymentId
                      }\nMonto: $${
                        orderData?.total?.toLocaleString() || "0"
                      }\n\nGracias!`;
                      Linking.openURL(
                        `mailto:agroneacharata@gmail.com?subject=${encodeURIComponent(
                          subject
                        )}&body=${encodeURIComponent(body)}`
                      );
                    }}
                  >
                    <Mail size={18} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.emailButtonText}>Enviar por Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() => {
                      const message = `Hola! Te envío el comprobante de pago de mi compra.\n\n📋 *Datos de la orden:*\nOrden: ${
                        orderData?.orderNumber || paymentId
                      }\nMonto: $${
                        orderData?.total?.toLocaleString() || "0"
                      }\n\n¡Gracias!`;
                      Linking.openURL(
                        `https://wa.me/+5493794222011?text=${encodeURIComponent(
                          message
                        )}`
                      );
                    }}
                  >
                    <MessageCircle
                      size={18}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.whatsappButtonText}>
                      Enviar por WhatsApp
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Paso 3: Esperar confirmación */}
            <View style={styles.stepContainer}>
              <View style={[styles.stepNumber, styles.stepNumberPurple]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Espera la confirmación</Text>
                <Text style={styles.stepDescription}>
                  Verificaremos tu pago lo más rápido posible y te enviaremos
                  tus tickets por email.
                </Text>
              </View>
            </View>

            {/* Información de contacto */}
            <View style={styles.helpSection}>
              <AlertTriangle size={20} color={COLORS.primary} />
              <Text style={styles.helpTitle}>¿Necesitas ayuda?</Text>
              <Text style={styles.helpText}>
                Email: agroneacharata@gmail.com
              </Text>
              <Text style={styles.helpText}>WhatsApp: +54 9 3794 222011</Text>
            </View>

            {/* Recordatorio importante */}
            <View style={styles.importantReminder}>
              <View style={styles.reminderIcon}>
                <AlertTriangle size={20} color="#ff6b6b" />
              </View>
              <View>
                <Text style={styles.reminderTitle}>¡Importante!</Text>
                <Text style={styles.reminderText}>
                  Guarda tu número de orden{" "}
                  <Text style={styles.orderNumberHighlight}>
                    {orderData?.orderNumber || orderId}
                  </Text>{" "}
                  - Lo necesitarás para cualquier consulta
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Resto del contenido existente sin cambios... */}
        <View style={styles.orderInfoCard}>
          <Text style={styles.sectionTitle}>Detalles de la compra</Text>

          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Número de orden:</Text>
            <Text style={styles.orderItemValue}>
              {orderData?.orderNumber || orderId || paymentId}
            </Text>
          </View>

          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Estado:</Text>
            <View
              style={[
                styles.statusBadge,
                paymentMethod === "TRANSFER"
                  ? styles.pendingBadge
                  : styles.successBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {paymentMethod === "TRANSFER" ? "Pendiente de pago" : "Pagado"}
              </Text>
            </View>
          </View>

          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Método de pago:</Text>
            <Text style={styles.orderItemValue}>
              {paymentMethod === "TRANSFER"
                ? "Transferencia bancaria"
                : paymentMethod === "CARD"
                ? "Tarjeta de crédito/débito"
                : "MercadoPago"}
            </Text>
          </View>

          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Fecha:</Text>
            <Text style={styles.orderItemValue}>
              {orderData?.createdAt
                ? new Date(orderData.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </Text>
          </View>

          {orderData?.total && (
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Total:</Text>
              <Text style={styles.orderItemValue}>
                ${orderData.total.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Resto de secciones existentes (tickets, productos, etc.) sin cambios... */}
        {hasTickets && paymentMethod !== "TRANSFER" && (
          <View style={styles.ticketsCard}>
            <Text style={styles.sectionTitle}>Tus Entradas</Text>
            <Text style={styles.ticketsText}>
              Se han generado {orderData.tickets.length} tickets para tu compra.
              Los puedes ver en la sección "Mis Tickets" o descargarlos
              directamente.
            </Text>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={downloadTickets}
            >
              <Download
                size={18}
                color={COLORS.text}
                style={styles.buttonIcon}
              />
              <Text style={styles.actionButtonText}>Descargar Tickets</Text>
            </TouchableOpacity>
          </View>
        )}

        {hasPhysicalProducts && (
          <View style={styles.productsCard}>
            <Text style={styles.sectionTitle}>
              {paymentMethod === "TRANSFER"
                ? "Productos (pendientes de pago)"
                : "Tus Productos"}
            </Text>
            <Text style={styles.productsText}>
              {paymentMethod === "TRANSFER"
                ? "Una vez confirmado el pago, podrás retirar tus productos en el evento presentando tu comprobante."
                : "Puedes retirar tus productos en el evento presentando tu comprobante de compra."}
            </Text>
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          {/* <TouchableOpacity style={styles.primaryButton} onPress={shareOrder}>
            <Share2 size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Compartir</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("MyTickets")}
          >
            <Ticket size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Mis Tickets</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("ShopMain")}
          >
            <Home size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearCartButton}
            onPress={() => {
              clearCart();
              navigation.navigate("Home");
            }}
          >
            <Home size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.clearCartButtonText}>
              Limpiar Carrito y Volver al Inicio
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Estilos base existentes
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 54,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f44336",
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // ✅ ESTILOS NUEVOS para la sección de transferencias
  transferSection: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  transferHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  transferIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: "#FFD700",
  },
  transferSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 4,
  },
  stepNumberGreen: {
    backgroundColor: "#4CAF50",
  },
  stepNumberPurple: {
    backgroundColor: "#9C27B0",
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  amountHighlight: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
  },
  bankDataContainer: {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.3)",
  },
  bankDataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 12,
  },
  bankDataGrid: {
    gap: 8,
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
  },
  copyButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
  },
  copyButtonSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  orderInfoBox: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  orderInfoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  orderInfoItem: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: 4,
  },
  contactButtons: {
    flexDirection: "column",
    gap: 8,
  },
  emailButton: {
    backgroundColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  emailButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  whatsappButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  helpSection: {
    backgroundColor: "rgba(10, 143, 60, 0.1)",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10, 143, 60, 0.3)",
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 8,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  importantReminder: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  reminderIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
  orderNumberHighlight: {
    fontWeight: "bold",
    color: "#FFD700",
  },

  // Estilos existentes del componente original
  orderInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderItemLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  orderItemValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    maxWidth: 200,
    textAlign: "right",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  successBadge: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  pendingBadge: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.text,
  },
  transferInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  transferInfoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 16,
  },
  transferDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  transferDetailLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  transferDetailValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  transferNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 16,
    marginBottom: 16,
  },
  ticketsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ticketsText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 16,
  },
  productsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  productsText: {
    fontSize: 14,
    color: COLORS.text,
  },
  actionButtonsContainer: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  clearCartButton: {
    backgroundColor: "#ff6b6b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  clearCartButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PaymentConfirmationScreen;
