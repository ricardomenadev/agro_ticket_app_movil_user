// Detalle de un producto de la tienda: todas sus fotos (deslizando), descripción, cantidad y agregar al carrito.
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../feed/FeedCards";

const PHOTO_W = Dimensions.get("window").width - 36;
const money = (n) => `$ ${Math.round(n || 0).toLocaleString("es-AR")}`;

/** product: el producto (null = cerrado). inCart: cantidad que ya tiene en el carrito. onSave(cantidad) */
const ProductSheet = ({ product, photos, price, oldPrice, inCart, onSave, onClose }) => {
  const [qty, setQty] = useState(Math.max(1, inCart || 1));
  const [page, setPage] = useState(0);
  if (!product) return null;
  const max = Math.min(50, product.stock || 50);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <TouchableOpacity onPress={onClose} style={styles.close} hitSlop={12} accessibilityLabel="Cerrar">
          <Ionicons name="close" size={24} color={C.text} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 8 }}>
          {photos.length ? (
            <View>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / PHOTO_W))}
                style={styles.gallery}
              >
                {photos.map((uri, i) => (
                  <Image key={uri} source={{ uri }} style={styles.photo} resizeMode="contain" accessibilityLabel={`Foto ${i + 1} de ${photos.length}`} />
                ))}
              </ScrollView>
              {photos.length > 1 ? (
                <View style={styles.dots}>
                  {photos.map((uri, i) => (
                    <View key={uri} style={[styles.dot, i === page && styles.dotActive]} />
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.name}>{product.nombre}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{money(price)}</Text>
            {oldPrice ? <Text style={styles.oldPrice}>{money(oldPrice)}</Text> : null}
          </View>
          {product.descripcion ? <Text style={styles.description}>{product.descripcion}</Text> : null}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.stepBtn} accessibilityLabel="Uno menos">
              <Ionicons name="remove" size={20} color={C.text} />
            </TouchableOpacity>
            <Text style={styles.qty} accessibilityLabel={`Cantidad ${qty}`}>{qty}</Text>
            <TouchableOpacity onPress={() => setQty((q) => Math.min(max, q + 1))} style={styles.stepBtn} accessibilityLabel="Uno más">
              <Ionicons name="add" size={20} color={C.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => onSave(qty)} activeOpacity={0.85}>
            <Text style={styles.addText}>{inCart ? "Actualizar carrito" : "Agregar al carrito"} · {money(price * qty)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { maxHeight: "88%", backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, paddingBottom: 28, borderTopWidth: 1, borderColor: C.border },
  handle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: C.borderStrong, marginBottom: 10 },
  close: { position: "absolute", top: 14, right: 16, zIndex: 2 },
  gallery: { width: PHOTO_W, borderRadius: 16, backgroundColor: "#fff" },
  photo: { width: PHOTO_W, height: PHOTO_W * 0.8 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.borderStrong },
  dotActive: { backgroundColor: C.gold, width: 18 },
  name: { color: C.text, fontSize: 20, fontWeight: "800" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10 },
  price: { color: C.text, fontSize: 22, fontWeight: "800" },
  oldPrice: { color: C.muted, fontSize: 14, textDecorationLine: "line-through" },
  description: { color: C.soft, fontSize: 14, lineHeight: 21 },
  footer: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  stepper: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.borderStrong, borderRadius: 14 },
  stepBtn: { width: 44, height: 50, alignItems: "center", justifyContent: "center" },
  qty: { color: C.text, fontSize: 17, fontWeight: "800", minWidth: 26, textAlign: "center" },
  addBtn: { flex: 1, minHeight: 52, borderRadius: 14, backgroundColor: C.green, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  addText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});

export default ProductSheet;
