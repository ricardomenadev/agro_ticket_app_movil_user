// Tienda: entradas y productos de Agronea todo el año. El carrito se arma acá y el pago se hace en
// agronea.store con Mercado Pago (el link lleva el carrito; los precios los vuelve a calcular el servidor).
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Linking, ActivityIndicator, Modal, Pressable } from "react-native";
import { useShopCart } from "../../context/ShopCartContext";
import ProductSheet from "../../components/shop/ProductSheet";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useStore } from "../../context/StoreContext";
import { useShowcase } from "../../api/apiFeed";
import { C } from "../../components/feed/FeedCards";

const STORE_URL = "https://agronea.store";
const API_BASE = "https://api.agronea.store";

const imageOf = (p) => {
  const url = p.images?.[0]?.url || p.imagen || p.image;
  if (!url || /placeholder/.test(url)) return null;
  return /^https?:\/\//.test(url) ? url.replace("http://localhost:5000", API_BASE) : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};
const isTicket = (p) => /^(ticket|parking)_/.test(p.sku || "");
const priceOf = (p) => (p.discountPrice && p.discountPrice < p.precio ? p.discountPrice : p.precio);
const onSale = (p) => Boolean(p.discountPrice && p.discountPrice < p.precio);
const money = (n) => `$ ${Math.round(n || 0).toLocaleString("es-AR")}`;

// Ítem del carrito web (mismo formato que guarda agronea.store en el teléfono)
const cartItem = (p, cantidad) => {
  const sku = p.sku || "";
  if (sku.startsWith("ticket_")) return { id: sku, tipo: "ticket", eventId: sku.slice(7), cantidad };
  if (sku.startsWith("parking_")) return { id: sku, tipo: "parking", eventId: sku.replace(/^parking_(moto_|vehicle_)?/, ""), cantidad };
  return { id: p.id, tipo: "producto", eventId: null, cantidad };
};
const base64url = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const AdBanner = () => {
  const showcase = useShowcase();
  const photo = showcase?.images?.[0]?.url || showcase?.images?.[0];
  const title = showcase?.settings?.title || "Agronea";
  const subtitle = showcase?.settings?.subtitle || "El evento del agro del Norte Argentino";
  const content = (
    <LinearGradient colors={photo ? ["rgba(0,0,0,0.15)", "rgba(0,0,0,0.85)"] : ["#0b3d1f", "#0a0a0a"]} style={styles.adInner}>
      <View style={styles.adLogoCard}>
        <Image source={require("../../../assets/images/logo_agronea_producciones.png")} style={styles.adLogo} resizeMode="contain" accessibilityLabel="Agronea Producciones" />
      </View>
      <Text style={styles.adTitle}>{title}</Text>
      <Text style={styles.adText}>{subtitle}</Text>
    </LinearGradient>
  );
  return photo ? (
    <ImageBackground source={{ uri: typeof photo === "string" ? photo : photo.url }} style={styles.ad} imageStyle={{ borderRadius: 18 }}>
      {content}
    </ImageBackground>
  ) : (
    <View style={styles.ad}>{content}</View>
  );
};

const ProductTile = ({ product, qty, onAdd, onRemove, onOpen }) => {
  const img = imageOf(product);
  return (
    <TouchableOpacity style={styles.tile} onPress={onOpen} activeOpacity={0.9} accessibilityRole="button" accessibilityLabel={`Ver ${product.nombre}`}>
      <View style={[styles.tileImgWrap, !img && { backgroundColor: C.photo }]}>
        {img ? <Image source={{ uri: img }} style={styles.tileImg} resizeMode="cover" /> : <Ionicons name={isTicket(product) ? "ticket-outline" : "bag-handle-outline"} size={34} color={C.muted} />}
        {onSale(product) ? <Text style={styles.saleBadge}>OFERTA</Text> : null}
      </View>
      <View style={styles.tileBody}>
        <Text style={styles.tileName} numberOfLines={2}>{product.nombre}</Text>
        {onSale(product) ? <Text style={styles.oldPrice}>{money(product.precio)}</Text> : null}
        <View style={styles.tileRow}>
          <Text style={styles.tilePrice}>{money(priceOf(product))}</Text>
          {qty ? (
            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={onRemove} style={styles.qtyBtn} accessibilityLabel={`Quitar uno de ${product.nombre}`}>
                <Ionicons name="remove" size={18} color={C.text} />
              </TouchableOpacity>
              <Text style={styles.qty}>{qty}</Text>
              <TouchableOpacity onPress={onAdd} style={[styles.qtyBtn, styles.qtyAdd]} accessibilityLabel={`Agregar otro ${product.nombre}`}>
                <Ionicons name="add" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onAdd} style={[styles.qtyBtn, styles.qtyAdd]} accessibilityLabel={`Agregar ${product.nombre} al carrito`}>
              <Ionicons name="add" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Todas las fotos del producto (la API manda `imagenes`; si no, la principal)
const photosOf = (p) => {
  const list = (p.imagenes?.length ? p.imagenes : [p.imagen]).map((url) => imageOf({ imagen: url }));
  return [...new Set(list.filter(Boolean))];
};

const ShopScreen = () => {
  const { products, events, loading } = useStore();
  const tabBarHeight = useBottomTabBarHeight();
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null); // producto abierto en el detalle
  const { items: cart, count, change, open, setOpen } = useShopCart();

  // Entradas y estacionamientos solo de eventos a la venta (la lista trae también los de ediciones pasadas)
  const available = useMemo(() => {
    const onSaleEvents = new Set((events || []).map((e) => e.id));
    return (products || []).filter(
      (p) => p.precio > 0 && (p.stock == null || p.stock > 0) && (!isTicket(p) || onSaleEvents.has(cartItem(p, 1).eventId))
    );
  }, [products, events]);
  const hasSales = available.some(onSale);
  const filters = [
    { id: "all", label: "Todo" },
    { id: "tickets", label: "Entradas" },
    { id: "products", label: "Productos" },
    ...(hasSales ? [{ id: "sale", label: "Ofertas" }] : []),
  ];
  const shown = available
    .filter((p) => (filter === "tickets" ? isTicket(p) : filter === "products" ? !isTicket(p) : filter === "sale" ? onSale(p) : true))
    .sort((a, b) => Number(b.destacado) - Number(a.destacado));

  const lines = available.filter((p) => cart[p.id]);
  const total = lines.reduce((s, p) => s + priceOf(p) * cart[p.id], 0);

  const pay = () => {
    try {
      const link = `${STORE_URL}/?carrito=${base64url(JSON.stringify(lines.map((p) => cartItem(p, cart[p.id]))))}`;
      setOpen(false);
      Linking.openURL(link).catch((err) => console.error("[tienda] no se pudo abrir el pago", err));
    } catch (err) {
      console.error("[tienda] no se pudo armar el carrito", err);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 30 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tienda</Text>
          <TouchableOpacity style={styles.cartIcon} onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel={`Ver carrito, ${count} productos`}>
            <Ionicons name="bag-handle-outline" size={22} color={C.text} />
            {count ? <Text style={styles.cartBadge}>{count}</Text> : null}
          </TouchableOpacity>
        </View>

        {count ? (
          <TouchableOpacity style={styles.viewCart} onPress={() => setOpen(true)} activeOpacity={0.85} accessibilityRole="button">
            <Ionicons name="bag-check-outline" size={20} color="#000" />
            <Text style={styles.viewCartText}>Ver carrito ({count}) · {money(total)}</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.chips}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, filter === f.id && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f.id }}
            >
              <Text style={[styles.chipText, filter === f.id && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <AdBanner />

        <Text style={styles.section}>{filter === "tickets" ? "Entradas" : filter === "sale" ? "Ofertas" : "Productos"}</Text>
        {loading && !available.length ? (
          <ActivityIndicator color={C.greenLight} style={{ marginTop: 24 }} />
        ) : shown.length ? (
          <View style={styles.grid}>
            {shown.map((p) => (
              <ProductTile key={p.id} product={p} qty={cart[p.id]} onAdd={() => change(p.id, 1)} onRemove={() => change(p.id, -1)} onOpen={() => setDetail(p)} />
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>{filter === "tickets" ? "Las entradas salen a la venta cuando se acerca la próxima edición." : "No hay productos por ahora."}</Text>
        )}
      </ScrollView>

      {detail ? (
        <ProductSheet
          key={detail.id}
          product={detail}
          photos={photosOf(detail)}
          price={priceOf(detail)}
          oldPrice={onSale(detail) ? detail.precio : null}
          inCart={cart[detail.id] || 0}
          onSave={(qty) => {
            change(detail.id, qty - (cart[detail.id] || 0));
            setDetail(null);
          }}
          onClose={() => setDetail(null)}
        />
      ) : null}

      {/* Carrito: sube desde abajo al tocar "Ver carrito" o el ícono de la bolsa */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setOpen(false)} accessibilityLabel="Cerrar carrito" />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Tu carrito</Text>
            <TouchableOpacity onPress={() => setOpen(false)} hitSlop={12} accessibilityLabel="Cerrar carrito">
              <Ionicons name="close" size={24} color={C.text} />
            </TouchableOpacity>
          </View>
          {lines.length ? (
            <>
              <ScrollView style={{ maxHeight: 340 }}>
                {lines.map((p) => (
                  <View key={p.id} style={styles.line}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.lineName} numberOfLines={2}>{p.nombre}</Text>
                      <Text style={styles.linePrice}>{money(priceOf(p))} c/u</Text>
                    </View>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity onPress={() => change(p.id, -1)} style={styles.qtyBtn} accessibilityLabel={`Quitar uno de ${p.nombre}`}>
                        <Ionicons name="remove" size={18} color={C.text} />
                      </TouchableOpacity>
                      <Text style={styles.qty}>{cart[p.id]}</Text>
                      <TouchableOpacity onPress={() => change(p.id, 1)} style={[styles.qtyBtn, styles.qtyAdd]} accessibilityLabel={`Agregar otro ${p.nombre}`}>
                        <Ionicons name="add" size={18} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.sheetTotalRow}>
                <Text style={styles.sheetTotalLabel}>Total</Text>
                <Text style={styles.sheetTotal}>{money(total)}</Text>
              </View>
              <TouchableOpacity style={styles.payBtn} onPress={pay} activeOpacity={0.85}>
                <Text style={styles.payBtnText}>Pagar con Mercado Pago</Text>
              </TouchableOpacity>
              <Text style={styles.sheetNote}>Se abre la tienda de Agronea para terminar el pago de forma segura.</Text>
            </>
          ) : (
            <Text style={styles.empty}>Todavía no agregaste nada.</Text>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: C.text, fontSize: 24, fontWeight: "800" },
  cartIcon: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, alignItems: "center", justifyContent: "center" },
  cartBadge: { position: "absolute", top: -6, right: -6, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: C.gold, color: "#000", fontSize: 11, fontWeight: "800", textAlign: "center", lineHeight: 20, overflow: "hidden" },
  viewCart: { minHeight: 48, borderRadius: 14, backgroundColor: C.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  viewCartText: { color: "#000", fontWeight: "800", fontSize: 15 },
  chips: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  chip: { minHeight: 38, paddingHorizontal: 16, borderRadius: 19, borderWidth: 1, borderColor: C.borderStrong, justifyContent: "center" },
  chipActive: { backgroundColor: C.green, borderColor: C.green },
  chipText: { color: C.soft, fontSize: 13 },
  chipTextActive: { color: C.text, fontWeight: "700" },
  ad: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: C.border },
  adInner: { padding: 20, alignItems: "center", gap: 6, minHeight: 170, justifyContent: "center" },
  // logo original sobre blanco, como en la web
  adLogoCard: { backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 6 },
  adLogo: { width: 180, height: 90 },
  adTitle: { color: C.gold, fontSize: 18, fontWeight: "800", textAlign: "center" },
  adText: { color: C.soft, fontSize: 13, textAlign: "center", lineHeight: 18 },
  section: { color: C.text, fontSize: 16, fontWeight: "700", marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  tile: { width: "48.5%", backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: "hidden" },
  tileImgWrap: { height: 120, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  tileImg: { width: "100%", height: "100%" },
  saleBadge: { position: "absolute", top: 8, left: 8, backgroundColor: C.gold, color: "#000", fontSize: 10, fontWeight: "800", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: "hidden" },
  tileBody: { padding: 10, gap: 4 },
  tileName: { color: C.text, fontSize: 13, fontWeight: "700", lineHeight: 17, minHeight: 34 },
  oldPrice: { color: C.muted, fontSize: 11, textDecorationLine: "line-through" },
  tileRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tilePrice: { color: C.text, fontSize: 15, fontWeight: "800", flexShrink: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  qtyBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: C.borderStrong, alignItems: "center", justifyContent: "center" },
  qtyAdd: { backgroundColor: C.greenLight, borderColor: C.greenLight },
  qty: { color: C.text, fontWeight: "800", minWidth: 16, textAlign: "center" },
  empty: { color: C.muted, fontSize: 13, textAlign: "center", marginTop: 16 },
  sheetBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, paddingBottom: 32, gap: 12, borderTopWidth: 1, borderColor: C.border },
  sheetHandle: { alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: C.borderStrong },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sheetTitle: { color: C.text, fontSize: 20, fontWeight: "800" },
  line: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  lineName: { color: C.text, fontSize: 14, fontWeight: "700" },
  linePrice: { color: C.muted, fontSize: 12, marginTop: 2 },
  sheetTotalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 },
  sheetTotalLabel: { color: C.muted, fontSize: 14 },
  sheetTotal: { color: C.text, fontSize: 22, fontWeight: "800" },
  payBtn: { minHeight: 52, borderRadius: 14, backgroundColor: C.green, alignItems: "center", justifyContent: "center" },
  payBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  sheetNote: { color: C.muted, fontSize: 11, textAlign: "center" },
});

export default ShopScreen;
