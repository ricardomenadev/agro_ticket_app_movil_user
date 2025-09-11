import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Image
} from 'react-native';
import { COLORS } from '../../constants/colors';

const TermsConditionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logos/agronea-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Términos y Condiciones</Text>
          <Text style={styles.headerSubtitle}>
            Aplicación móvil AGRONEA 2025
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Aceptación de los Términos</Text>
          <Text style={styles.sectionText}>
            Al descargar, instalar y utilizar la aplicación móvil AGRONEA 2025, usted acepta 
            estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con 
            alguno de estos términos, no utilice la aplicación.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Descripción del Servicio</Text>
          <Text style={styles.sectionText}>
            La aplicación AGRONEA 2025 es una plataforma digital desarrollada por AGRONEA 
            PRODUCCIONES S.R.L. que permite a los usuarios acceder a información sobre 
            eventos agropecuarios, expositores, programación de actividades, mapas de ubicación, 
            y enlaces a servicios de terceros como la tienda online.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Uso de la Aplicación</Text>
          <Text style={styles.sectionText}>
            La aplicación se proporciona para uso personal y no comercial. Los usuarios se 
            comprometen a:
          </Text>
          <Text style={styles.listText}>
            • Utilizar la aplicación de manera responsable y legal{'\n'}
            • No intentar acceder a áreas restringidas del sistema{'\n'}
            • No reproducir, distribuir o modificar el contenido sin autorización{'\n'}
            • Respetar los derechos de propiedad intelectual
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacidad y Datos Personales</Text>
          <Text style={styles.sectionText}>
            La aplicación puede recopilar información básica del dispositivo para mejorar 
            la experiencia del usuario. No se recopilan datos personales sin el consentimiento 
            explícito del usuario. Para más detalles, consulte nuestra Política de Privacidad.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Servicios de Terceros</Text>
          <Text style={styles.sectionText}>
            La aplicación puede contener enlaces a servicios de terceros (como la tienda online 
            en agronea.store). AGRONEA PRODUCCIONES S.R.L. no se hace responsable por el 
            contenido, políticas de privacidad o prácticas de estos servicios externos.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Propiedad Intelectual</Text>
          <Text style={styles.sectionText}>
            Todos los contenidos de la aplicación, incluyendo textos, imágenes, logotipos, 
            diseños y código fuente, son propiedad de AGRONEA PRODUCCIONES S.R.L. o de sus 
            licenciantes y están protegidos por las leyes de propiedad intelectual.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitación de Responsabilidad</Text>
          <Text style={styles.sectionText}>
            AGRONEA PRODUCCIONES S.R.L. no será responsable por daños directos, indirectos, 
            incidentales o consecuentes que puedan derivar del uso de la aplicación. La 
            aplicación se proporciona "tal como está" sin garantías de ningún tipo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Actualizaciones y Modificaciones</Text>
          <Text style={styles.sectionText}>
            AGRONEA PRODUCCIONES S.R.L. se reserva el derecho de actualizar, modificar o 
            discontinuar la aplicación en cualquier momento sin previo aviso. Asimismo, 
            estos términos y condiciones pueden ser modificados periódicamente.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Disponibilidad del Servicio</Text>
          <Text style={styles.sectionText}>
            No garantizamos que la aplicación esté disponible de manera ininterrumpida o 
            libre de errores. Podemos suspender temporalmente el servicio por mantenimiento, 
            actualizaciones o causas técnicas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Ley Aplicable y Jurisdicción</Text>
          <Text style={styles.sectionText}>
            Estos términos y condiciones se regirán por las leyes de la República Argentina. 
            Cualquier disputa será sometida a la jurisdicción de los tribunales competentes 
            de la Provincia del Chaco.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Contacto</Text>
          <Text style={styles.sectionText}>
            Para consultas sobre estos términos y condiciones, puede contactarnos a través de:
          </Text>
          <Text style={styles.contactText}>
            Email: agroneacharata@gmail.com{'\n'}
            WhatsApp: +54 379 4222011{'\n'}
            Dirección: Caseros 474 - Charata, Chaco, Argentina
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Última actualización: Agosto 2025
          </Text>
          <Text style={styles.footerSubtext}>
            © 2025 AGRONEA PRODUCCIONES S.R.L. - Todos los derechos reservados
          </Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  listText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginLeft: 16,
    marginTop: 8,
  },
  contactText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 8,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default TermsConditionsScreen;