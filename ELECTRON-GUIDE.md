# 🖥️ AI Photo Booth - Versión Electron (Escritorio)

## 🎯 Ventajas de la versión de escritorio

✅ **Aspecto profesional** - Ventana nativa sin barra del navegador  
✅ **Pantalla completa inmersiva** - Sin necesidad de presionar F11  
✅ **Código QR funcional** - Los usuarios escanean y descargan directo a su celular  
✅ **Offline ready** - Una vez instalado, funciona sin necesidad de servidor web  
✅ **Acceso directo a hardware** - Mejor control de cámara y permisos  
✅ **Ejecutable standalone** - Instalador .exe para Windows

---

## 📦 Instalación y Desarrollo

### 1. Instalar dependencias adicionales

```bash
npm install
```

Esto instalará automáticamente:

- `electron` - Framework para apps de escritorio
- `electron-builder` - Para crear instaladores
- `express` - Servidor HTTP para descargas via QR
- `concurrently` - Para ejecutar Vite + Electron simultáneamente
- `wait-on` - Para esperar que Vite esté listo

### 2. Ejecutar en modo desarrollo

```bash
npm run dev:electron
```

Esto hará:

1. Inicia Vite en `http://localhost:3000`
2. Espera a que Vite esté listo
3. Abre la aplicación Electron
4. Habilita DevTools para debugging

**Atajos útiles:**

- `Ctrl + R` - Recargar la app
- `Ctrl + Shift + I` - Abrir DevTools
- `Ctrl + Q` - Cerrar la aplicación

### 3. Construir para producción

#### Windows (ejecutable .exe)

```bash
npm run package:win
```

Genera:

- `release/AI Photo Booth Setup 1.0.0.exe` (instalador NSIS)
- Incluye desinstalador automático
- Crea acceso directo en el menú inicio

#### macOS (archivo .dmg)

```bash
npm run package:mac
```

Genera:

- `release/AI Photo Booth-1.0.0.dmg`
- Drag & drop para instalar

#### Linux (AppImage)

```bash
npm run package:linux
```

Genera:

- `release/AI Photo Booth-1.0.0.AppImage`
- Ejecutable portable

---

## 🔧 Cómo funciona el sistema de QR

### Arquitectura:

```
┌─────────────────────────────────────────┐
│         Electron App (Pantalla)         │
│  ┌───────────────────────────────────┐  │
│  │   React UI (Frontend)             │  │
│  │   - Usuario genera foto           │  │
│  │   - Click en "Código QR"          │  │
│  └───────────────┬───────────────────┘  │
│                  │ IPC                   │
│  ┌───────────────▼───────────────────┐  │
│  │   Electron Main Process           │  │
│  │   - Guarda foto en /temp          │  │
│  │   - Genera ID único (abc123)      │  │
│  │   - Inicia servidor HTTP:3001     │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼───────────────────────┘
                   │
                   │ HTTP
                   │
         ┌─────────▼──────────┐
         │  Mini Servidor     │
         │  http://IP:3001    │
         │  /download/abc123  │
         └─────────┬──────────┘
                   │
                   │ WiFi local
                   │
         ┌─────────▼──────────┐
         │   📱 Celular       │
         │   Escanea QR       │
         │   Descarga foto    │
         └────────────────────┘
```

### Flujo paso a paso:

1. **Usuario genera foto** → Se muestra en pantalla con 2 variaciones
2. **Click en "📱 Código QR"** → La app:
   - Guarda la foto seleccionada en `C:\Users\...\Temp\ai-photo-booth\`
   - Crea un ID único: `a7f3b9e2c1d4f8g5`
   - Genera URL: `http://192.168.1.100:3001/download/a7f3b9e2c1d4f8g5`
   - Crea código QR con esa URL
3. **Usuario escanea QR** → Su celular:
   - Se conecta al servidor local de la PC
   - Descarga el archivo PNG directamente
4. **Auto-limpieza** → Después de 30 minutos, la foto se elimina del temp

---

## 📱 Configuración de red

### Requisitos:

- **PC y celular en la misma WiFi** (misma red local)
- **Firewall de Windows** debe permitir el puerto 3001

### Permitir en Firewall (si es necesario):

1. Abrir PowerShell como administrador:

```powershell
New-NetFirewallRule -DisplayName "AI Photo Booth Server" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

2. O manualmente:
   - Panel de Control → Firewall de Windows
   - Reglas de entrada → Nueva regla
   - Puerto TCP 3001 → Permitir

### Verificar IP de la PC:

```powershell
ipconfig
```

Busca algo como: `IPv4 Address: 192.168.1.100`

---

## 🎨 Personalización

### Cambiar el icono de la app:

1. Coloca un archivo `icon.png` (1024x1024 px) en la carpeta `build/`
2. Electron Builder lo convertirá automáticamente a .ico (Windows) y .icns (macOS)

### Cambiar el nombre de la app:

Edita `package.json`:

```json
{
  "productName": "Mi Photo Booth Personalizado",
  "build": {
    "appId": "com.miempresa.photobooth"
  }
}
```

### Configurar pantalla completa por defecto:

Edita `electron/main.js`:

```javascript
mainWindow = new BrowserWindow({
  fullscreen: true, // true = pantalla completa al abrir
  kiosk: true, // Modo kiosco (bloquea salir con Alt+Tab)
  // ...
});
```

---

## 🚀 Despliegue para Eventos

### Opción 1: Instalador (recomendado)

1. Construye el instalador:

   ```bash
   npm run package:win
   ```

2. Copia el archivo `release/AI Photo Booth Setup 1.0.0.exe` a una USB

3. En la PC del evento:

   - Ejecuta el instalador
   - Acepta los permisos
   - La app se abre automáticamente

4. **Configurar API Key** (solo primera vez):
   - Crea un archivo `.env.local` en:
     ```
     C:\Users\<Usuario>\AppData\Local\Programs\ai-photo-booth-desktop\.env.local
     ```
   - Contenido:
     ```
     GEMINI_API_KEY=tu_api_key_aqui
     ```

### Opción 2: Portable (sin instalador)

1. Construye la app:

   ```bash
   npm run build
   ```

2. Copia toda la carpeta del proyecto a la PC del evento

3. Ejecuta:
   ```bash
   npm run electron
   ```

---

## 🐛 Solución de problemas

### La cámara no funciona

✅ Verifica permisos en: Configuración → Privacidad → Cámara  
✅ Reinicia la app con `Ctrl + Q` y vuelve a abrir

### El QR no funciona / Celular no puede descargar

✅ Verifica que PC y celular estén en la misma WiFi  
✅ Desactiva temporalmente el Firewall para probar  
✅ Verifica la IP de la PC con `ipconfig`

### La app no genera imágenes

✅ Verifica que la API Key esté configurada  
✅ Verifica conexión a internet (necesaria para Gemini API)  
✅ Revisa la consola con `Ctrl + Shift + I`

### El instalador no se ejecuta

✅ Windows Defender puede bloquearlo (falso positivo)  
✅ Click derecho → "Ejecutar de todas formas"

---

## 📊 Comparación: Web vs Electron

| Característica        | Versión Web          | Versión Electron     |
| --------------------- | -------------------- | -------------------- |
| **Instalación**       | No requiere          | Requiere instalador  |
| **Aspecto**           | Barra del navegador  | Ventana nativa       |
| **Pantalla completa** | F11 manual           | Automática           |
| **Código QR**         | Solo URL web         | Descarga directa     |
| **Offline**           | ❌ Requiere servidor | ✅ Standalone        |
| **Actualizaciones**   | Automáticas          | Manual o auto-update |
| **Rendimiento**       | Bueno                | Mejor                |
| **Permisos cámara**   | Solicita cada vez    | Guarda permisos      |

---

## 🔐 Seguridad

### API Key:

- **Nunca** incluyas la API key en el código fuente
- Usa variables de entorno (`.env.local`)
- En producción, considera un backend proxy

### Fotos temporales:

- Se guardan en carpeta temporal del sistema
- Se eliminan automáticamente después de 30 minutos
- Se limpian al cerrar la aplicación

### Servidor HTTP:

- Solo escucha en la red local (no expuesto a internet)
- Los IDs de descarga son aleatorios de 32 caracteres
- Las URLs expiran después de 30 minutos

---

## 📞 Soporte

¿Problemas? Revisa:

- Logs en la consola: `Ctrl + Shift + I`
- Documentación de Electron: https://www.electronjs.org/docs
- Issues en GitHub del proyecto

---

## 🎉 ¡Listo!

Tu app de escritorio está configurada y lista para eventos profesionales.

**Próximos pasos recomendados:**

1. ✅ Probar en la PC del evento antes del día
2. ✅ Configurar WiFi estable
3. ✅ Tener un diseño de fondo personalizado (opcional)
4. ✅ Preparar un cartel con instrucciones para usuarios
