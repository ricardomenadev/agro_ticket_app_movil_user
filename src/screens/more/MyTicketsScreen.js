import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS } from '../../constants/colors';

// Datos de ejemplo de entradas
const tickets = [
  {
    id: 'T1001',
    type: 'Entrada General',
    date: '4 de Julio, 2025',
    valid: true,
    qrData: 'AGRONEA2025-T1001-GENERAL'
  },
  {
    id: 'T1002',
    type: 'Estacionamiento',
    date: '4 de Julio, 2025',
    valid: true,
    qrData: 'AGRONEA2025-T1002-PARKING'
  }
];

const TicketCard = ({ ticket }) => {
  return (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View>
          <Text style={styles.ticketType}>{ticket.type}</Text>
          <Text style={styles.ticketDate}>{ticket.date}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          ticket.valid ? styles.validBadge : styles.invalidBadge
        ]}>
          <Text style={styles.statusText}>
            {ticket.valid ? 'Válido' : 'Usado'}
          </Text>
        </View>
      </View>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={ticket.qrData}
          size={200}
          backgroundColor='white'
          color='black'
        />
      </View>
      
      <Text style={styles.ticketId}>ID: {ticket.id}</Text>
      
      <View style={styles.ticketActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Guardar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Compartir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MyTicketsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Entradas</Text>
        <Text style={styles.headerSubtitle}>
          Presenta estos códigos QR en el ingreso al evento
        </Text>
      </View>
      
      {tickets.length > 0 ? (
        <View style={styles.ticketsContainer}>
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No tienes entradas aún</Text>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ticketsContainer: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ticketType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ticketDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  validBadge: {
    backgroundColor: `${COLORS.success}20`,
  },
  invalidBadge: {
    backgroundColor: `${COLORS.error}20`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
  },
  ticketId: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyTicketsScreen;