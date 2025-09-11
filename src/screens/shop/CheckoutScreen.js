import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { ArrowLeft, Check } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useStore } from "../../context/StoreContext";
import * as apiMobile from "../../api/apiMobile";

// Importar los componentes modulares
import BuyerInfoStep from "../../components/shop/BuyerInfoStep";
import DeliveryMethodStep from "../../components/shop/DeliveryMethodStep";
import PaymentMethodStep from "../../components/shop/PaymentMethodStep";

const CheckoutScreen = ({ navigation }) => {
  const { state, total, clearCart, dispatch } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [buyerInfo, setBuyerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dni: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { items: cartItems = [] } = state.cart || {};

  // Verificar si hay productos en el carrito
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      Alert.alert("Carrito vacío", "No hay productos en el carrito", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [cartItems, navigation]);

  // Manejar cambio de paso
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Procesar pago según el método seleccionado
 const handleProcessPayment = async (paymentData) => {
  try {
    console.log("🔶 CHECKOUT: Procesando pago:", paymentMethod);
    console.log("🔶 CHECKOUT: Datos recibidos:", paymentData);
    setIsProcessing(true);
    setError(null);

    if (!cartItems || cartItems.length === 0) {
      throw new Error("No hay productos en el carrito");
    }

    if (paymentMethod === "TRANSFER") {
      console.log("🔶 CHECKOUT: Procesando respuesta de transferencia...");
      
      if (paymentData && paymentData.success && paymentData.orderData) {
        console.log("✅ CHECKOUT: Transferencia ya procesada, navegando...");

        // ✅ NAVEGAR PRIMERO (antes de limpiar carrito)
        navigation.replace("PaymentConfirmation", {
          orderId: paymentData.orderData.order?.orderNumber || paymentData.paymentId,
          paymentMethod: "TRANSFER",
          paymentId: paymentData.paymentId,
          status: "PENDING",
        });

        // // ✅ LIMPIAR CARRITO DESPUÉS de navegar (con delay para asegurar navegación)
        // setTimeout(() => {
        //   console.log("🧹 CHECKOUT: Limpiando carrito después de navegar...");
        //   clearCart();
        // }, 100);

      } else {
        throw new Error("No se recibieron datos válidos de la transferencia");
      }

    } else if (paymentMethod === "CARD") {
      console.log("🔶 CHECKOUT: Procesando respuesta de tarjeta...");
      
      if (paymentData && paymentData.success) {
        console.log("✅ CHECKOUT: Pago con tarjeta exitoso, navegando...");
        
        // ✅ NAVEGAR PRIMERO
        navigation.replace("PaymentConfirmation", {
          orderId: paymentData.orderData?.order?.orderNumber || paymentData.paymentId,
          paymentMethod: "CARD",
          paymentId: paymentData.paymentId,
          status: paymentData.status || "APPROVED",
        });

        // ✅ LIMPIAR CARRITO DESPUÉS
        // setTimeout(() => {
        //   console.log("🧹 CHECKOUT: Limpiando carrito después de navegar...");
        //   clearCart();
        // }, 2000);

      } else {
        throw new Error("Error al procesar el pago con tarjeta");
      }

    } else {
      throw new Error("Método de pago no válido");
    }

  } catch (error) {
    console.error("🔴 CHECKOUT: Error procesando pago:", error);
    setError(error.message || "Error al procesar el pago. Intenta nuevamente.");
  } finally {
    setIsProcessing(false);
  }
};

  // Iconos para los pasos
  const renderStepIcon = (step, active) => {
    if (step < currentStep) {
      return <Check size={20} color={COLORS.text} />;
    }

    return (
      <Text style={[styles.stepNumber, active ? styles.activeStepNumber : {}]}>
        {step + 1}
      </Text>
    );
  };

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BuyerInfoStep
            buyerInfo={buyerInfo}
            setBuyerInfo={setBuyerInfo}
            onNext={handleNextStep}
          />
        );
      case 1:
        return (
          <DeliveryMethodStep
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 2:
        return (
          <PaymentMethodStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onSubmit={handleProcessPayment}
            onBack={handlePrevStep}
            isProcessing={isProcessing}
            buyerInfo={buyerInfo}
            cartItems={cartItems}
            total={total}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else {
              navigation.goBack();
            }
          }}
          disabled={isProcessing}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        {[0, 1, 2].map((step) => (
          <View key={step} style={styles.progressStep}>
            <View
              style={[
                styles.stepIconContainer,
                step <= currentStep ? styles.activeStepIconContainer : {},
              ]}
            >
              {renderStepIcon(step, step === currentStep)}
            </View>
            {step < 2 && (
              <View
                style={[
                  styles.progressLine,
                  step < currentStep ? styles.activeProgressLine : {},
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Labels de los pasos */}
      <View style={styles.stepsLabelContainer}>
        <Text
          style={[
            styles.stepLabel,
            currentStep >= 0 ? styles.activeStepLabel : {},
          ]}
        >
          Comprador
        </Text>
        <Text
          style={[
            styles.stepLabel,
            currentStep >= 1 ? styles.activeStepLabel : {},
          ]}
        >
          Entrega
        </Text>
        <Text
          style={[
            styles.stepLabel,
            currentStep >= 2 ? styles.activeStepLabel : {},
          ]}
        >
          Pago
        </Text>
      </View>

      {/* Mostrar errores generales */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => setError(null)}
          >
            <Text style={styles.errorButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenido principal */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={[styles.contentContainer, { paddingBottom: 100 }]}>
          {renderCurrentStep()}

          {/* Resumen de la orden en el paso final */}
          {currentStep === 2 && (
            <View style={styles.orderSummary}>
              <Text style={styles.summaryTitle}>Resumen de tu compra</Text>
              
              {cartItems.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <Text style={styles.summaryItemName}>
                    {item.nombre || item.name}
                  </Text>
                  <Text style={styles.summaryItemDetails}>
                    Cantidad: {item.cantidad || item.quantity} × $
                    {(item.precio || item.price).toLocaleString()}
                  </Text>
                  <Text style={styles.summaryItemTotal}>
                    $
                    {(
                      (item.precio || item.price) *
                      (item.cantidad || item.quantity)
                    ).toLocaleString()}
                  </Text>
                </View>
              ))}
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryTotal}>
                <Text style={styles.summaryTotalLabel}>Total:</Text>
                <Text style={styles.summaryTotalValue}>
                  ${total.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  placeholder: {
    width: 32,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  activeStepIconContainer: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  activeStepNumber: {
    color: COLORS.text,
  },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.border,
  },
  activeProgressLine: {
    backgroundColor: COLORS.primary,
  },
  stepsLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stepLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: "33%",
    textAlign: "center",
  },
  activeStepLabel: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#ff000020",
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 8,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginBottom: 12,
  },
  errorButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ff0000",
    borderRadius: 4,
  },
  errorButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  
  // Estilos para el resumen de orden
  orderSummary: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  summaryItemDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryItemTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "right",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});

export default CheckoutScreen;