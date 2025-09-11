import React, { useState } from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  StyleSheet,
  Text
} from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';

const SmartImage = ({
  source,
  style,
  fallbackText = '',
  showLoading = true,
  resizeMode = 'cover',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = (errorEvent) => {
    if (__DEV__) {
      console.warn('❌ Error cargando imagen:', source, errorEvent.nativeEvent?.error);
    }
    setLoading(false);
    setError(true);
  };

  // Si no hay source, mostrar placeholder inmediatamente
  if (!source) {
    return (
      <View style={[style, styles.placeholder]}>
        {fallbackText ? (
          <Text style={styles.fallbackText}>
            {fallbackText.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <ImageIcon size={24} color={COLORS.textSecondary} />
        )}
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={[style, loading && styles.loading]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading overlay */}
      {loading && showLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loadingOverlay]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
      
      {/* Error placeholder */}
      {error && (
        <View style={[StyleSheet.absoluteFill, styles.errorOverlay]}>
          {fallbackText ? (
            <Text style={styles.fallbackText}>
              {fallbackText.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <ImageIcon size={24} color={COLORS.textSecondary} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loading: {
    opacity: 0.7,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default SmartImage;