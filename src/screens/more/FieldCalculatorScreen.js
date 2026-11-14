// Calculadora del campo: valor de la cosecha, conversor de quintales y "cuánto tengo que vender".
// Usa los últimos precios guardados en el teléfono, así anda sin señal.
import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C, Chips } from "../../components/feed/FeedCards";
import { useMarkets } from "../../api/apiFeed";
import { useShare } from "../../components/share/ShareProvider";
import { num, harvest, convert, toSell } from "../../utils/fieldCalc";

const pesos = (n) => `$ ${Math.round(n).toLocaleString("es-AR")}`;
const fmt = (n, d = 1) => n.toLocaleString("es-AR", { maximumFractionDigits: d });

const Field = ({ label, value, onChange, suffix, placeholder = "0" }) => (
  <View style={s.field}>
    <Text style={s.label}>{label}</Text>
    <View style={s.inputRow}>
      <TextInput style={s.input} value={value} onChangeText={onChange} keyboardType="decimal-pad" placeholder={placeholder} placeholderTextColor={C.muted} />
      {suffix ? <Text style={s.suffix}>{suffix}</Text> : null}
    </View>
  </View>
);

const Result = ({ rows, onShare }) => (
  <View style={s.result}>
    {rows.map((r) => (
      <View key={r.label} style={s.resRow}>
        <Text style={s.resLabel}>{r.label}</Text>
        <Text style={[s.resValue, r.strong && s.resStrong]}>{r.value}</Text>
      </View>
    ))}
    {onShare ? (
      <TouchableOpacity style={s.shareBtn} onPress={onShare} accessibilityRole="button">
        <Ionicons name="logo-whatsapp" size={18} color="#fff" />
        <Text style={s.shareText}>Compartir resultado</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const Card = ({ icon, title, children }) => (
  <View style={s.card}>
    <View style={s.cardHead}>
      <Ionicons name={icon} size={20} color={C.gold} />
      <Text style={s.cardTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const FieldCalculatorScreen = () => {
  const { markets } = useMarkets();
  const share = useShare();
  const grains = (markets?.grains?.items || []).filter((g) => g.price);
  const cattle = markets?.cattle?.items || [];
  const official = markets?.dollar?.items?.find((d) => d.id === "oficial")?.sell || markets?.dollar?.sell;

  // 1. Cosecha
  const [crop, setCrop] = useState("soja");
  const [ha, setHa] = useState("");
  const [qq, setQq] = useState("");
  const [priceText, setPriceText] = useState("");
  const grain = grains.find((g) => g.id === crop) || grains[0];
  const price = num(priceText) || grain?.price || 0;
  const h = harvest({ hectares: num(ha), yieldQq: num(qq), pricePerTon: price, dollar: official });
  const harvestRows = [
    { label: "Toneladas", value: fmt(h.tons) },
    { label: "Por hectárea", value: pesos(h.perHectare) },
    ...(h.usd ? [{ label: "En dólares (oficial)", value: `US$ ${fmt(h.usd, 0)}` }] : []),
    { label: "Tu cosecha vale", value: pesos(h.total), strong: true },
  ];

  // 2. Conversor
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("qq");
  const cv = convert(num(amount), unit);

  // 3. Cuánto tengo que vender
  const [need, setNeed] = useState("");
  const novillo = cattle.find((c) => c.id === "novillos");
  const sellRows = [
    novillo && { label: "Kilos de novillo", value: `${fmt(toSell(num(need), novillo.price), 0)} kg` },
    ...["soja", "maiz", "trigo"].map((id) => {
      const g = grains.find((x) => x.id === id);
      return g && { label: `Toneladas de ${g.name.toLowerCase()}`, value: `${fmt(toSell(num(need), g.price))} t` };
    }),
  ].filter(Boolean);

  const sourceLine = `Precios: pizarra Rosario ${markets?.grains?.date || ""} · Cañuelas ${markets?.cattle?.date || ""}`;

  return (
    <ScrollView style={s.safe} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Text style={s.intro}>Cuentas rápidas con los precios del día. Si no tenés señal, usa los últimos precios guardados.</Text>

      <Card icon="leaf-outline" title="¿Cuánto vale mi cosecha?">
        {grains.length ? (
          <Chips options={grains.map((g) => ({ id: g.id, label: g.name }))} value={grain?.id} onChange={(id) => { setCrop(id); setPriceText(""); }} />
        ) : (
          <Text style={s.hint}>Abrí Mercados una vez con señal para cargar los precios.</Text>
        )}
        <View style={s.pair}>
          <Field label="Hectáreas" value={ha} onChange={setHa} suffix="ha" />
          <Field label="Rinde" value={qq} onChange={setQq} suffix="qq/ha" />
        </View>
        <Field label={`Precio por tonelada${grain ? ` (pizarra: ${pesos(grain.price)})` : ""}`} value={priceText} onChange={setPriceText} suffix="$/t" placeholder={grain ? String(grain.price) : "0"} />
        <Result
          rows={harvestRows}
          onShare={h.total ? () => share({
            eyebrow: "CALCULADORA DEL CAMPO",
            title: `${fmt(num(ha), 0)} ha de ${grain?.name?.toLowerCase() || "cosecha"} a ${fmt(num(qq))} qq/ha`,
            rows: harvestRows,
            source: `Precio ${pesos(price)}/t · ${sourceLine}`,
          }) : null}
        />
      </Card>

      <Card icon="swap-horizontal-outline" title="Quintales, toneladas y kilos">
        <Chips options={[{ id: "qq", label: "Quintales" }, { id: "t", label: "Toneladas" }, { id: "kg", label: "Kilos" }]} value={unit} onChange={setUnit} />
        <Field label="Cantidad" value={amount} onChange={setAmount} suffix={unit} />
        <Result rows={[
          { label: "Kilos", value: `${fmt(cv.kg, 0)} kg` },
          { label: "Quintales", value: `${fmt(cv.qq, 2)} qq` },
          { label: "Toneladas", value: `${fmt(cv.t, 3)} t` },
        ]} />
      </Card>

      <Card icon="cash-outline" title="¿Cuánto tengo que vender?">
        <Text style={s.hint}>Para pagar algo (gasoil, semilla, un tractor…), cuánto equivale en hacienda o granos.</Text>
        <Field label="Monto a pagar" value={need} onChange={setNeed} suffix="$" />
        <Result
          rows={sellRows}
          onShare={num(need) && sellRows.length ? () => share({
            eyebrow: "CALCULADORA DEL CAMPO",
            title: `Para juntar ${pesos(num(need))} hay que vender…`,
            rows: sellRows,
            source: sourceLine,
          }) : null}
        />
      </Card>
      <Text style={s.hint}>{sourceLine}. Son valores de referencia: el precio final lo define tu comprador.</Text>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, gap: 16 },
  intro: { color: C.soft, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardTitle: { color: C.text, fontSize: 17, fontWeight: "800" },
  pair: { flexDirection: "row", gap: 10 },
  field: { flex: 1, gap: 6 },
  label: { color: C.muted, fontSize: 12, fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", borderColor: C.borderStrong, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, minHeight: 48 },
  input: { flex: 1, color: C.text, fontSize: 18, fontWeight: "700", paddingVertical: 8 },
  suffix: { color: C.muted, fontSize: 13, fontWeight: "600" },
  result: { backgroundColor: C.greenDeep, borderRadius: 14, padding: 14, gap: 8 },
  resRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  resLabel: { color: C.soft, fontSize: 13, flexShrink: 1 },
  resValue: { color: C.text, fontSize: 16, fontWeight: "800" },
  resStrong: { color: C.gold, fontSize: 22 },
  shareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44, borderRadius: 12, backgroundColor: "#25D366", marginTop: 6 },
  shareText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  hint: { color: C.muted, fontSize: 12, lineHeight: 17 },
});

export default FieldCalculatorScreen;
