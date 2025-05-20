import React, { useEffect, useState } from 'react';
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
  Linking
} from 'react-native';
import { Check, Share2, ArrowRight, Ticket, Home, Download } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import * as apiMobile from '../../api/apiMobile';

const PaymentConfirmationScreen = ({ route, navigation }) => {
  const { orderId, paymentMethod, paymentId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  
  // Verificar estado de la orden
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId && !paymentId) {
          setError("No se encontró información de la orden");
          setLoading(false);
          return;
        }
        
        // Obtener detalles de la orden
        const result = await apiMobile.checkOrderStatus(orderId || paymentId);
        
        if (result.success && result.order) {
          setOrderData(result.order);
        } else {
          setError("No se pudo obtener la información de la orden");
        }
      } catch (err) {
        console.error("Error obteniendo detalles de la orden:", err);
        setError("Error al obtener la información de la orden");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, paymentId]);
  
  // Función para compartir información de la compra
  const shareOrder = async () => {
    try {
      const message = `¡He realizado mi compra para AGRONEA 2025! Número de orden: ${orderData.orderNumber || orderId || paymentId}. ¡Nos vemos allí!`;
      
      await Share.share({
        message,
        title: 'Mi Compra AGRONEA 2025',
      });
    } catch (error) {
      console.error("Error compartiendo orden:", error);
    }
  };
  
  // Función para descargar tickets
  const downloadTickets = async () => {
    try {
      // Implementar lógica para descargar tickets
      // Puede ser navegando a otra pantalla o utilizando la API para generar un PDF
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
  
  // Verificar si hay tickets en la orden
  const hasTickets = orderData && 
                    orderData.tickets && 
                    Array.isArray(orderData.tickets) && 
                    orderData.tickets.length > 0;
  
  // Verificar si hay productos físicos en la orden
  const hasPhysicalProducts = orderData && 
                            orderData.items && 
                            Array.isArray(orderData.items) && 
                            orderData.items.some(item => item.type === 'producto' || item.tipo === 'producto');
  
  // Renderizar estado de carga
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Obteniendo información de tu compra...</Text>
      </SafeAreaView>
    );
  }
  
  // Renderizar error
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.navigate('Home')}
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
        <View style={styles.successContainer}>
          <View style={styles.checkCircle}>
            <Check size={40} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>¡Compra Exitosa!</Text>
          <Text style={styles.successText}>
            Tu compra ha sido procesada correctamente.
            {paymentMethod === "TRANSFER" ? 
              " Recibirás un email con los detalles para realizar la transferencia." : 
              " Recibirás un email con tus tickets y detalles de la compra."}
          </Text>
        </View>
        
        <View style={styles.orderInfoCard}>
          <Text style={styles.sectionTitle}>Detalles de la compra</Text>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Número de orden:</Text>
            <Text style={styles.orderItemValue}>{orderData?.orderNumber || orderId || paymentId}</Text>
          </View>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Estado:</Text>
            <View style={[
              styles.statusBadge,
              paymentMethod === "TRANSFER" ? styles.pendingBadge : styles.successBadge
            ]}>
              <Text style={styles.statusText}>
                {paymentMethod === "TRANSFER" ? "Pendiente de pago" : "Pagado"}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Método de pago:</Text>
            <Text style={styles.orderItemValue}>
              {paymentMethod === "TRANSFER" ? 
                "Transferencia bancaria" : 
                paymentMethod === "CARD" ? 
                  "Tarjeta de crédito/débito" : "MercadoPago"}
            </Text>
          </View>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Fecha:</Text>
            <Text style={styles.orderItemValue}>
              {orderData?.createdAt ? 
                new Date(orderData.createdAt).toLocaleDateString() : 
                new Date().toLocaleDateString()}
            </Text>
          </View>
          
          {orderData?.total && (
            <View style={styles.orderItem}>
              <Text style={styles.orderItemLabel}>Total:</Text>
              <Text style={styles.orderItemValue}>${orderData.total.toLocaleString()}</Text>
            </View>
          )}
        </View>
        
        {paymentMethod === "TRANSFER" && (
          <View style={styles.transferInfoCard}>
            <Text style={styles.sectionTitle}>Información de pago</Text>
            <Text style={styles.transferInfoText}>
              Para completar tu compra, realiza una transferencia con los siguientes datos:
            </Text>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>Banco:</Text>
              <Text style={styles.transferDetailValue}>Banco Nación Argentina</Text>
            </View>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>Titular:</Text>
              <Text style={styles.transferDetailValue}>AGRONEA S.A.</Text>
            </View>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>CUIT:</Text>
              <Text style={styles.transferDetailValue}>30-71234567-8</Text>
            </View>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>CBU:</Text>
              <Text style={styles.transferDetailValue}>0110000000000000000000</Text>
            </View>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>Alias:</Text>
              <Text style={styles.transferDetailValue}>AGRONEA.2025.EVENTO</Text>
            </View>
            
            <View style={styles.transferDetail}>
              <Text style={styles.transferDetailLabel}>Monto:</Text>
              <Text style={styles.transferDetailValue}>
                ${orderData?.total ? orderData.total.toLocaleString() : "Consultar email"}
              </Text>
            </View>
            
            <Text style={styles.transferNote}>
              Una vez realizada la transferencia, envía el comprobante a pagos@agronea.com.ar indicando el número de orden.
            </Text>
            
            <TouchableOpacity 
              style={styles.emailButton}
              onPress={() => {
                Linking.openURL(`mailto:pagos@agronea.com.ar?subject=Comprobante de pago - Orden ${orderData?.orderNumber || orderId || paymentId}`);
              }}
            >
              <Text style={styles.emailButtonText}>Enviar comprobante por email</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {hasTickets && paymentMethod !== "TRANSFER" && (
          <View style={styles.ticketsCard}>
            <Text style={styles.sectionTitle}>Tus Entradas</Text>
            <Text style={styles.ticketsText}>
              Se han generado {orderData.tickets.length} tickets para tu compra. 
              Los puedes ver en la sección "Mis Tickets" o descargarlos directamente.
            </Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={downloadTickets}
            >
              <Download size={18} color={COLORS.text} style={styles.buttonIcon} />
              <Text style={styles.actionButtonText}>Descargar Tickets</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {hasPhysicalProducts && (
          <View style={styles.productsCard}>
            <Text style={styles.sectionTitle}>
              {paymentMethod === "TRANSFER" ? 
                "Productos (pendientes de pago)" : 
                "Tus Productos"}
            </Text>
            <Text style={styles.productsText}>
              {paymentMethod === "TRANSFER" ? 
                "Una vez confirmado el pago, podrás retirar tus productos en el evento presentando tu comprobante." :
                "Puedes retirar tus productos en el evento presentando tu comprobante de compra."}
            </Text>
          </View>
        )}
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={shareOrder}
          >
            <Share2 size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Compartir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MyTickets')}
          >
            <Ticket size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Mis Tickets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Home size={18} color={COLORS.text} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  orderInfoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '500',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  successBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    marginBottom: 8,
  },
  transferDetailLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: 'bold',
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
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 16,
  },
  emailButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  emailButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PaymentConfirmationScreen;