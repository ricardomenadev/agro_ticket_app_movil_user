// src/constants/exhibitors2026.js
//
// Combina los datos (exhibitorsData2026.js) con el poster (require()).
// La union con la posicion en el mapa se hace por id en standPositions.js.
//
// Para agregar un poster nuevo:
//   1. Poner la imagen en assets/images/exhibitors/
//   2. Agregar la clave (id oficial) en POSTER_MAP apuntando al archivo

import { EXHIBITORS_DATA } from './exhibitorsData2026';

export const CATEGORIES = [
  { id: 'maquinaria',    label: 'Maquinaria',             icon: 'construct-outline' },
  { id: 'insumos',       label: 'Insumos y Semillas',     icon: 'leaf-outline' },
  { id: 'vehiculos',     label: 'Vehículos',              icon: 'car-outline' },
  { id: 'servicios',     label: 'Servicios y Tecnología', icon: 'laptop-outline' },
  { id: 'financiero',    label: 'Financiero',             icon: 'card-outline' },
  { id: 'institucional', label: 'Institucional',          icon: 'school-outline' },
  { id: 'gastronomia',   label: 'Gastronomía',            icon: 'restaurant-outline' },
  { id: 'otros',         label: 'Otros',                  icon: 'ellipsis-horizontal-outline' },
];

// Mapa de id (oficial) -> imagen de poster.
// La CLAVE es el id oficial del expositor; el ARCHIVO mantiene su nombre original en disco.
const POSTER_MAP = {
  difamaq: require('../../assets/images/exhibitors/difamaq.jpg'),
  donnet: require('../../assets/images/exhibitors/donnet.jpg'),
  akron: require('../../assets/images/exhibitors/akron.jpg'),
  nordemaq_s_a: require('../../assets/images/exhibitors/nordemaq.jpg'),
  ombu: require('../../assets/images/exhibitors/ombu.jpg'),
  maquinagro: require('../../assets/images/exhibitors/maquinagro.jpg'),
  agrobiciuffa: require('../../assets/images/exhibitors/agrobiciuffa.jpg'),
  crimag: require('../../assets/images/exhibitors/crimag.jpg'),
  norte_semillas: require('../../assets/images/exhibitors/norte_semillas.jpg'),
  tbeh_equipos_agro_viales_s_a: require('../../assets/images/exhibitors/tbeh.jpg'),
  super_al_cas: require('../../assets/images/exhibitors/super_alcas.jpg'),
  yomel: require('../../assets/images/exhibitors/yomel.jpg'),
  r_l_servicios: require('../../assets/images/exhibitors/ryl.jpg'),
  balanzas_misiones: require('../../assets/images/exhibitors/balanzas_misiones.jpg'),
  schab_perforaciones: require('../../assets/images/exhibitors/schab.jpg'),
  siid: require('../../assets/images/exhibitors/controlagro.jpg'),
  bremen: require('../../assets/images/exhibitors/bremen.jpg'),
  autopartes_kennedy: require('../../assets/images/exhibitors/kennedy.jpg'),
  gonar_scania: require('../../assets/images/exhibitors/gonar.jpg'),
  chaco_servicios: require('../../assets/images/exhibitors/chaco_servicios.jpg'),
  bazyluk_camiones: require('../../assets/images/exhibitors/bazyluk.jpg'),
  derka_y_vargas: require('../../assets/images/exhibitors/derka_vargas.jpg'),
  acogra: require('../../assets/images/exhibitors/acogra.jpg'),
  agrospray: require('../../assets/images/exhibitors/agrospray.jpg'),
  el_boro: require('../../assets/images/exhibitors/el_boro.jpg'),
  agroservicios_san_francisco_s_a: require('../../assets/images/exhibitors/agroservicios_sf.jpg'),
  tgn: require('../../assets/images/exhibitors/tgn.jpg'),
  agricoltures_federados_argentinos: require('../../assets/images/exhibitors/afa.jpg'),
  grow_capital_s_a: require('../../assets/images/exhibitors/grow_capital.jpg'),
  union_agricola_de_avellaneda: require('../../assets/images/exhibitors/uaa.jpg'),
  centro_de_servicios_norte: require('../../assets/images/exhibitors/csn.jpg'),
  ceta_capital_humano: require('../../assets/images/exhibitors/ceta.jpg'),
  agrocor: require('../../assets/images/exhibitors/agrocor.jpg'),
  uncaus: require('../../assets/images/exhibitors/uncaus.jpg'),
  ministerio_de_educacion_del_chaco: require('../../assets/images/exhibitors/ministerio_educacion.jpg'),
  wetala: require('../../assets/images/exhibitors/wetala.jpg'),
  aserradero_yimmy: require('../../assets/images/exhibitors/aserradero_yimmy.jpg'),
  dondavid: require('../../assets/images/exhibitors/dondavid.jpg'),
  ag_maquinarias: require('../../assets/images/exhibitors/ag_maquinas.jpg'),
  abelardo_cuffia: require('../../assets/images/exhibitors/abelardo_cuffia.jpg'),
  franco_fabril: require('../../assets/images/exhibitors/scheidegger.jpg'),
  metalurgica_canalis: require('../../assets/images/exhibitors/canalis.jpg'),
  berplast: require('../../assets/images/exhibitors/berplast.jpg'),
  glazen_camiones: require('../../assets/images/exhibitors/glazen.jpg'),
  metalurgica_camperos_s_a: require('../../assets/images/exhibitors/pampero.jpg'),
  transpaq: require('../../assets/images/exhibitors/transpaq.jpg'),
  maniagro: require('../../assets/images/exhibitors/maniagro.jpg'),
  brique_s_r_l: require('../../assets/images/exhibitors/brique.jpg'),
  inducar: require('../../assets/images/exhibitors/inducar.jpg'),
  agco_argentina_valtra: require('../../assets/images/exhibitors/valtra.jpg'),
  geosistemas: require('../../assets/images/exhibitors/geosistemas.jpg'),
  prodata: require('../../assets/images/exhibitors/prodata.jpg'),
  tecnoagronorte: require('../../assets/images/exhibitors/tecnoagro_norte.jpg'),
  tecnomateriales: require('../../assets/images/exhibitors/tecnomateriales.jpg'),
  mainero: require('../../assets/images/exhibitors/mainero.jpg'),
  swagemakers_maquinas_viales: require('../../assets/images/exhibitors/swagemakers.jpg'),
  munoz_marchesi: require('../../assets/images/exhibitors/munoz_marchesi.jpg'),
  banco_credicoop: require('../../assets/images/exhibitors/credicoop.jpg'),
  fechaco: require('../../assets/images/exhibitors/fechaco.jpg'),
  almundo: require('../../assets/images/exhibitors/almundo.jpg'),
  norte_gruas: require('../../assets/images/exhibitors/norte_gruas.jpg'),
  municipalidad_de_pampa_del_infierno: require('../../assets/images/exhibitors/pampa_infierno.jpg'),
  alerta_roja: require('../../assets/images/exhibitors/alerta_roja.jpg'),
  ops_consulting: require('../../assets/images/exhibitors/ops_consulting.jpg'),
  rodolfo_weibel: require('../../assets/images/exhibitors/wiebel.jpg'),
  betra: require('../../assets/images/exhibitors/betra.jpg'),
  el_capullo: require('../../assets/images/exhibitors/el_capullo.jpg'),
  aceitera_general_deheza: require('../../assets/images/exhibitors/agd.jpg'),
  metalfor: require('../../assets/images/exhibitors/metalfor.jpg'),
  genersol: require('../../assets/images/exhibitors/genersol.jpg'),
  facyt: require('../../assets/images/exhibitors/facyt.jpg'),
  triunfo_seguros: require('../../assets/images/exhibitors/triunfo_seguros.jpg'),
  molinos_agro: require('../../assets/images/exhibitors/molinos_agro.jpg'),
  sancor_salud: require('../../assets/images/exhibitors/sancor_salud.jpg'),
  

// ============================================================================
// BLOQUE 2 — Agregar estas líneas al POSTER_MAP de exhibitors2026.js
//
// IMPORTANTE: agregá cada línea SOLO cuando el archivo de imagen ya exista en
// assets/images/exhibitors/. Si ponés un require() de una imagen que no está,
// el bundle se rompe. Los que todavía no tengan imagen, dejalos sin línea:
// el componente muestra el fallback (agronea2026publi.jpg) automáticamente.
//
// Nombrá las imágenes EXACTAMENTE como el archivo indicado en cada require.
// ============================================================================

  //drap_sas: require('../../assets/images/exhibitors/drap_sas.jpg'),
  //vialidad_provincial: require('../../assets/images/exhibitors/vialidad_provincial.jpg'),
  //favaron_servicios: require('../../assets/images/exhibitors/favaron_servicios.jpg'),
  //rodante_scf: require('../../assets/images/exhibitors/rodante_scf.jpg'),
  //instituto_miguel_nemes: require('../../assets/images/exhibitors/instituto_miguel_nemes.jpg'),
  //aguas_ada: require('../../assets/images/exhibitors/aguas_ada.jpg'),
  //morena_pochoclos: require('../../assets/images/exhibitors/morena_pochoclos.jpg'),
};

// Combina datos + poster. Los que no tienen imagen quedan con poster: null
// y el componente ExhibitorPoster muestra el placeholder automaticamente.
export const EXHIBITORS = EXHIBITORS_DATA.map(expositor => ({
  ...expositor,
  poster: POSTER_MAP[expositor.id] ?? null,
}));