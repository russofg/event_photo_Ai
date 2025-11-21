# 🔧 Pasos para Migrar a Electron

## ✅ Lo que ya está hecho:

1. ✅ Estructura de Electron creada (`electron/main.js` y `preload.js`)
2. ✅ Servicio de QR implementado (`services/qrService.ts`)
3. ✅ Componente App.tsx actualizado con modal de QR
4. ✅ package.json configurado con scripts de Electron
5. ✅ Express server integrado para descargas via QR

## 📋 Pasos para completar la migración:

### 1. Instalar dependencias de Electron

```bash
npm install
```

Esto instalará:

- electron
- electron-builder
- express
- concurrently
- wait-on

### 2. Probar en modo desarrollo

```bash
npm run dev:electron
```

Debería:

- Abrir Vite en localhost:3000
- Luego abrir ventana de Electron
- Funcionar igual que en el navegador

### 3. Crear icono de la aplicación (opcional pero recomendado)

Crea una carpeta `build/` y coloca un archivo `icon.png` (1024x1024 px)

### 4. Configurar variables de entorno para Electron

El archivo `.env.local` funciona igual, pero asegúrate de que esté en la raíz del proyecto.

### 5. Construir instalador para Windows

```bash
npm run package:win
```

Esto generará:

- `release/AI Photo Booth Setup 1.0.0.exe`

### 6. Probar el instalador

1. Ejecuta el instalador
2. La app se abrirá en pantalla completa
3. Prueba capturar una foto
4. Prueba generar imagen
5. Prueba el botón "📱 Código QR"
6. Escanea el QR con tu celular (debe estar en la misma WiFi)

## 🎯 Características nuevas en Electron:

### Código QR funcional:

- Click en "📱 Código QR"
- Se muestra un modal con el código QR
- Los usuarios escanean con su celular
- Descargan la foto directamente a su dispositivo

### Servidor HTTP local:

- Se inicia automáticamente al abrir la app
- Escucha en puerto 3001
- Solo accesible en la red local
- Las fotos se guardan temporalmente y se eliminan después de 30 min

### Pantalla completa nativa:

- Se abre automáticamente en fullscreen
- Sin barra del navegador
- Aspecto más profesional
- Salir con Ctrl+Q

## 🔍 Diferencias clave vs versión web:

| Funcionalidad     | Web              | Electron                   |
| ----------------- | ---------------- | -------------------------- |
| Guardar foto      | Download browser | Servidor local + QR        |
| Pantalla completa | F11              | Nativo                     |
| Instalación       | No requiere      | .exe instalador            |
| QR Code           | URL web          | IP local + puerto          |
| Offline           | ❌               | ✅ (excepto API de Gemini) |

## ⚠️ Consideraciones importantes:

### Red local:

- La PC con la app y los celulares que escanean el QR **deben estar en la misma WiFi**
- Si no hay WiFi, considera crear un hotspot con la PC

### Firewall:

- Windows puede bloquear el puerto 3001
- Si el QR no funciona, agregar regla de firewall (ver ELECTRON-GUIDE.md)

### API Key:

- Sigue usando `.env.local`
- Gemini API requiere conexión a internet (no es offline completo)

## 🚀 Despliegue para evento:

### Método 1: Instalador (más fácil)

1. `npm run package:win`
2. Copia el .exe a USB
3. Instala en la PC del evento
4. Configura `.env.local` con la API key
5. Ejecuta la app

### Método 2: Portable

1. Copia toda la carpeta del proyecto
2. En la PC del evento: `npm install`
3. `npm run electron`

## 📝 Archivos importantes:

```
ai-magic-editor---event-mode/
├── electron/
│   ├── main.js           # Proceso principal de Electron
│   └── preload.js        # Puente seguro entre main y renderer
├── services/
│   ├── geminiService.ts  # API de Gemini (existente)
│   └── qrService.ts      # Nuevo: generación de QR y guardado
├── App.tsx               # Actualizado con modal de QR
├── package.json          # Scripts de Electron agregados
├── ELECTRON-GUIDE.md     # Guía completa de uso
└── .env.local            # API key (igual que antes)
```

## ✅ Checklist de pruebas:

- [ ] `npm install` ejecuta sin errores
- [ ] `npm run dev:electron` abre la ventana de Electron
- [ ] La cámara funciona en Electron
- [ ] Se pueden generar imágenes con IA
- [ ] El botón "📱 Código QR" muestra el modal
- [ ] El QR se genera correctamente
- [ ] Al escanear el QR desde el celular, se descarga la foto
- [ ] `npm run package:win` genera el instalador
- [ ] El instalador .exe funciona en otra PC

## 🎉 Resultado final:

Una aplicación de escritorio profesional que:

- ✅ Se ve como app nativa (no navegador)
- ✅ Funciona en pantalla completa automáticamente
- ✅ Permite a usuarios descargar fotos con QR
- ✅ Se puede instalar con un .exe
- ✅ Ideal para eventos corporativos

---

**¿Necesitas ayuda?** Revisa `ELECTRON-GUIDE.md` para documentación completa.
