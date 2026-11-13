# Cómo publicar la app "Agronea Producciones" en las tiendas

> **Obligatorio.** Cualquier persona o sesión de Claude que publique la app sigue esta guía al pie de la letra.
> Si un paso falla o algo no coincide con lo que dice acá: **se frena y se avisa.** No se improvisa con las tiendas.

---

## 1. Cómo funciona (en simple)

1. **EAS Build** (Expo) compila la app en sus computadoras, no en la tuya. Android tarda ~10 min; con el plan gratis a veces espera **más de 1 hora en la cola** antes de arrancar.
2. **EAS Submit** sube lo compilado a Google Play (y a App Store) usando claves guardadas en Expo.
3. **Lo que queda en manos del dueño:** el OK para mandar a revisión, y esperar que Google / Apple aprueben (de horas a 1 o 2 días). En Google Play, al aprobarse sale sola a todos (la "publicación gestionada" está apagada).

---

## 2. Datos fijos

| Qué | Valor |
|---|---|
| App | Agronea Producciones · Expo SDK 54 |
| Paquete Android / Bundle iOS | `com.agroapp.user` — **nunca se cambia** |
| Proyecto Expo | `@ricardomenadev/agro_app_movil_user` (projectId `542dc9de-3794-4562-8c40-b287c953b005`) |
| Play Console | Cuenta de desarrollador "Wesyx" → app "Agronea" |
| Versiones | `appVersionSource: "local"`: se suben **a mano** en `app.json` |
| Envío a Google Play | `eas.json` → `submit.production.android`: pista **production**, estado **draft** (borrador) |
| Clave para subir a Google Play | Cuenta de servicio `eas-submit@agronea-3d2e7.iam.gserviceaccount.com` (proyecto Google Cloud "Agronea"), invitada en Play Console solo a la app Agronea. Su clave JSON está cargada en expo.dev → Credentials → Android → "Google service account key for EAS Submit" |
| Política de privacidad | `https://agronea.store/privacidad` (cargada en Play Console → Contenido de la aplicación). Google no deja mandar a revisión si este link no abre |
| API que usa la app | `https://api.agronea.store` (el código ya la tiene por defecto) |

---

## 3. Reglas

1. **Nada se compila, se sube ni se manda a revisión sin el OK explícito del dueño.** Son tres OK distintos: compilar, subir como borrador y "Enviar a revisión".
2. **Nunca se tocan** `package`, `bundleIdentifier`, `projectId` ni las credenciales de Expo (keystore, certificados, claves).
3. **Las claves secretas las crea y las carga el dueño**, nunca Claude: la clave JSON de Google, la clave `.p8` de Apple y cualquier API key. Claude solo guía.
4. **El build de producción no lleva `.env.local`** (apunta a localhost, solo para el emulador). EAS no lo sube porque está en `.gitignore`: verificar que siga ahí.
5. Commits de una línea en español.
6. Textos de "Novedades" simples, para clientes poco técnicos.

---

## 4. Checklist antes de compilar

- [ ] Todo commiteado en la rama a publicar (`git status` limpio, salvo `google-services.json`, que no se commitea).
- [ ] Probado en el emulador lo que cambió (ver 7.2).
- [ ] **Si la versión nueva necesita cambios del servidor o la web, primero se despliegan** (ver `DEPLOY.md` del repo `agronea_tienda_app`). Si no, la app nueva llama a cosas que todavía no existen.
- [ ] Números subidos en `app.json` (los tres, y siempre más altos que el último publicado):
  - `version`: por ejemplo `1.4.1` → `1.4.2`
  - `android.versionCode`: +1 (Google rechaza uno repetido)
  - `ios.buildNumber`: +1
- [ ] Texto de "Novedades" aprobado por el dueño (menos de 500 letras).

---

## 5. Google Play, paso a paso

1. **Compilar** (con OK):
   ```bash
   EAS_SKIP_AUTO_FINGERPRINT=1 npx eas build --platform android --profile production --non-interactive --no-wait
   ```
   La subida del proyecto tarda ~10 min (son ~250 MB). Después se sigue en expo.dev o con
   `npx eas build:view <id> --json` hasta que diga `FINISHED`.
2. **Subir a Google Play como borrador** (con OK):
   ```bash
   npx eas submit --platform android --profile production --id <id-del-build> --non-interactive
   ```
   Tiene que terminar con "Submitted your app to Google Play Store!". Nadie la ve todavía.
3. **Play Console → Probar y publicar → Producción → Versiones → "Editar versión"** de la nueva:
   - Pegar las "Novedades" en los dos idiomas (`es-419` y `es-US`), con este formato:
     ```
     <es-419>
     Nueva versión de Agronea:
     • ...
     </es-419>
     <es-US>
     (el mismo texto)
     </es-US>
     ```
   - "Siguiente" → revisar: el App Bundle nuevo, SDK objetivo 36 y lanzamiento al **100 %**.
   - La advertencia "No hay ningún archivo de desofuscación" es normal, se ignora.
   - "Guardar" (todavía no se manda).
4. **Resumen de publicación** → si aparece "Ver N problema(s)", leerlos y arreglarlos antes de seguir. Con OK del dueño: **"Enviar cambios a revisión"** y confirmar.
5. **Cuando Google la apruebe y se vea en la tienda:** en el panel de agronea.store → **Menú de la app → Aviso de versión nueva**, poner el número nuevo. Así, a quien tenga una versión vieja le aparece el cartel para actualizar. "Obligatoria" solo si la versión vieja dejó de funcionar.

---

## 6. App Store (iPhone)

> **Pendiente de completar** cuando se haga la primera publicación por este camino.

Lo que se sabe hasta ahora:
- El build de iOS falla con "Provisioning Profile has expired": para renovarlo sin preguntas, Expo necesita una **clave de API de App Store Connect** (archivo `.p8`, rol "App Manager") cargada en expo.dev → Credentials → iOS. La crea y la sube el dueño (App Store Connect → Usuarios y acceso → Integraciones → App Store Connect API). El `.p8` se descarga **una sola vez**.
- En App Store Connect también hay que poner la política de privacidad `https://agronea.store/privacidad`.
- El último paso es "Enviar a revisión" en App Store Connect, con OK del dueño.

---

## 7. Problemas conocidos y cómo se resolvieron

1. **Google no deja mandar a revisión: "La página de la política de privacidad devuelve un error"** → el link estaba en un Google Doc que se borró. Ahora es `agronea.store/privacidad`; si vuelve a pasar, revisar que esa página abra.
2. **Probar en el emulador:** el emulador usa Expo Go. Para que apunte a producción y no a localhost:
   ```bash
   EXPO_PUBLIC_API_URL=https://api.agronea.store/api/mobile EXPO_PUBLIC_STORE_URL=https://agronea.store CI=1 npx expo start --port 8083 --clear
   ```
   y abrir `exp://<ip-de-la-pc>:8083` en Expo Go. En Windows, Metro a veces **no detecta los cambios**: cerrarlo y volver a arrancarlo con `--clear`.
3. **La cola de EAS** a veces tarda más de una hora antes de compilar: es normal en el plan gratis, no se relanza el build.
4. **Comandos con comillas desde PowerShell hacia el servidor (`ssh agronea '...'`)**: PowerShell le saca las comillas internas y el comando llega roto. Para cosas delicadas se deja un script en el servidor y se corre `ssh -t agronea bash /root/<script>.sh`.

---

## 8. Historial

| Versión | Android | iOS | Fecha | Notas |
|---|---|---|---|---|
| 1.3.6 | 39 | 14 | jul 2026 | Última antes del rediseño |
| 1.4.0 | 40 | — | 28 oct 2026 | Entradas con QR sin señal, pasar entradas, invitaciones. Primera subida con `eas submit` |
| 1.4.1 | 41 | — | 2 nov 2026 | Inicio con portada de noticias, "Agro hoy", "Continuar compra", menú Más nuevo, footer |
| 1.4.2 | 42 | — | 3 nov 2026 | Chat desde el panel, todos los dólares, aviso de actualización nuevo |
| 1.4.3 | 43 | — | 12 nov 2026 | Video emergente desde el panel (WhatsApp y "Ahora no"), prensa en el menú Más, ícono de notificaciones. Mandada a revisión el 12/11 |
