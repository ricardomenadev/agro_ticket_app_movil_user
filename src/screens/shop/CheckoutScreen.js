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
// import OrderSummary from './OrderSummary';
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
    console.log("Procesando pago:", paymentMethod);
    setIsProcessing(true);
    setError(null);

    // Verificar que hay items en el carrito
    if (!cartItems || cartItems.length === 0) {
      throw new Error("No hay productos en el carrito");
    }

    // Asegurarse de que paymentId/payment_id sean strings
    if (paymentData.payment_id && typeof paymentData.payment_id !== 'string') {
      paymentData.payment_id = String(paymentData.payment_id);
      console.log(`Convertido payment_id a string: ${paymentData.payment_id}`);
    }

    if (paymentData.paymentId && typeof paymentData.paymentId !== 'string') {
      paymentData.paymentId = String(paymentData.paymentId);
      console.log(`Convertido paymentId a string: ${paymentData.paymentId}`);
    }

    // Asegurar consistencia: si existe paymentId pero no payment_id, usarlo
    if (!paymentData.payment_id && paymentData.paymentId) {
      paymentData.payment_id = paymentData.paymentId;
      console.log(`Asignado payment_id desde paymentId: ${paymentData.payment_id}`);
    }

    console.log(`Tipo de payment_id: ${typeof paymentData.payment_id}`);

    // Determinar qué función de API usar según el método de pago
    let response;
    if (paymentMethod === "CARD") {
      console.log("Procesando pago con tarjeta de crédito");
      // Agregar información adicional necesaria
      const cardPaymentData = {
        ...paymentData,
        paymentMethod: "CARD",
        deliveryMethod: deliveryMethod,
      };

      // Verificación adicional antes de enviar
      console.log(`ID de pago final: ${cardPaymentData.payment_id} (${typeof cardPaymentData.payment_id})`);
      
      response = await apiMobile.processCardPayment(cardPaymentData);
    } else if (paymentMethod === "MERCADOPAGO") {
      console.log("Procesando pago con MercadoPago");
      // Este método generalmente redirigiría a MercadoPago
      // Por ahora, simulamos una respuesta exitosa
      response = {
        success: true,
        status: "pending",
        payment_id: String(paymentData.payment_id), // Asegurar que sea string
        message: "Procesando pago con MercadoPago",
      };
    } else if (paymentMethod === "TRANSFER") {
      console.log("Procesando pago por transferencia");
      // Crear una orden pendiente de pago por transferencia
      response = await apiMobile.createOrder({
        items: cartItems,
        buyerInfo: buyerInfo,
        deliveryMethod: deliveryMethod,
        paymentMethod: "TRANSFER",
        total: total,
        payment_id: String(paymentData.payment_id), // Asegurar que sea string
      });
    } else {
      throw new Error("Método de pago no válido");
    }

    // Verificar respuesta
    if (response && (response.success || response.status === "SUCCESS")) {
      console.log("Pago procesado correctamente:", response);

      // Asegurar que payment_id es string en la respuesta también
      if (response.payment_id && typeof response.payment_id !== 'string') {
        response.payment_id = String(response.payment_id);
        console.log(`Convertido payment_id de respuesta a string: ${response.payment_id}`);
      }

      // Limpiar carrito después de compra exitosa
      clearCart();

      // Navegar a la pantalla de confirmación
      navigation.replace("PaymentConfirmation", {
        orderId: response.order?.orderNumber || response.orderId,
        paymentMethod: paymentMethod,
        paymentId: String(response.payment_id || paymentData.payment_id), // Asegurar que sea string
      });
    } else {
      // Manejar error de procesamiento
      console.error("Error en respuesta del servidor:", response);
      setError(
        response.error || "Error al procesar el pago. Intenta nuevamente."
      );
    }
  } catch (error) {
    console.error("Error procesando pago:", error);
    setError(
      error.message || "Error al procesar el pago. Intenta nuevamente."
    );
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
        </View>
      )}

      {/* Contenido principal */}
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderCurrentStep()}

          {/* Resumen de la orden siempre visible */}
          {/* <OrderSummary cartItems={cartItems} total={total} /> */}
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
    padding: 12,
    backgroundColor: "#ff000020",
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 8,
  },
  errorText: {
    color: "#ff0000",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});

export default CheckoutScreen;
