# 🚀 Guía de Despliegue en Netlify

## Opción 1: Despliegue desde GitHub (Recomendado)

### Paso 1: Preparar el repositorio

```bash
# Si no tienes Git inicializado:
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub y subir código:
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Netlify

1. Ve a [netlify.com](https://netlify.com) y crea una cuenta
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub** y autoriza el acceso
4. Elige tu repositorio
5. Configuración de build (Netlify lo detecta automáticamente):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - Deja el resto como está

### Paso 3: Configurar la API Key (IMPORTANTE)

1. En tu sitio de Netlify, ve a **Site settings** → **Environment variables**
2. Click en **"Add a variable"**
3. Agrega:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Tu API key real de Google Gemini
   - Scope: Deja todas las opciones marcadas
4. Click **"Save"**

### Paso 4: Desplegar

- Click en **"Deploy site"**
- Netlify construirá tu proyecto automáticamente
- En 2-3 minutos tendrás tu URL pública (ej: `https://tu-app.netlify.app`)

---

## Opción 2: Despliegue Manual (Drag & Drop)

### Paso 1: Construir localmente

```bash
# 1. Instala dependencias (si no lo has hecho)
npm install

# 2. Asegúrate de tener tu API key en .env.local
# Edita el archivo .env.local y reemplaza PLACEHOLDER_API_KEY con tu key real

# 3. Construye el proyecto
npm run build
```

### Paso 2: Subir a Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist` al área de "drop"
3. Netlify subirá los archivos

⚠️ **PROBLEMA:** Con este método, la API key estará en el código compilado (no es seguro).

**Solución:** Después de subir, ve a:

- **Site settings** → **Environment variables**
- Agrega `GEMINI_API_KEY` como variable de entorno
- Luego reconstruye desde el panel de Netlify

---

## 📋 Requisitos previos

### En tu computadora local:

✅ **Node.js 18+** instalado

- Verifica con: `node --version`
- Descarga desde: https://nodejs.org

✅ **API Key de Google Gemini**

- Obtén tu key en: https://aistudio.google.com/app/apikey
- Guárdala de forma segura

### En Netlify (automático):

- Netlify instala Node.js automáticamente (configurado en `netlify.toml`)
- No necesitas instalar nada manualmente

---

## 🔧 Archivos de configuración creados

### `netlify.toml`

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

Este archivo le dice a Netlify:

- Cómo construir el proyecto
- Dónde están los archivos finales
- Qué versión de Node usar
- Redirigir todas las rutas a `index.html` (para SPA)

---

## ⚙️ Variables de entorno necesarias

| Variable         | Dónde configurarla            | Valor                |
| ---------------- | ----------------------------- | -------------------- |
| `GEMINI_API_KEY` | Netlify Environment Variables | Tu API key de Gemini |

---

## 🎯 Checklist de despliegue

- [ ] Código subido a GitHub
- [ ] Cuenta de Netlify creada
- [ ] Repositorio conectado
- [ ] Variable `GEMINI_API_KEY` configurada en Netlify
- [ ] Build exitoso (ver logs en Netlify)
- [ ] Sitio desplegado y funcionando

---

## 🐛 Solución de problemas comunes

### Error: "GEMINI_API_KEY is not defined"

**Causa:** No configuraste la variable de entorno en Netlify
**Solución:** Ve a Site settings → Environment variables → Agrega `GEMINI_API_KEY`

### Error: "Build failed"

**Causa:** Falta alguna dependencia o hay errores de TypeScript
**Solución:**

1. Revisa los logs de build en Netlify
2. Prueba construir localmente: `npm run build`
3. Corrige los errores y sube los cambios

### La cámara no funciona

**Causa:** HTTPS es requerido para acceder a la cámara
**Solución:** Netlify sirve automáticamente sobre HTTPS, así que debería funcionar

### Imágenes no se generan

**Causa:** API key inválida o sin cuota
**Solución:**

1. Verifica tu API key en https://aistudio.google.com
2. Revisa que tengas cuota disponible en tu cuenta de Google AI

---

## 📱 Dominio personalizado (opcional)

Una vez desplegado, puedes configurar un dominio propio:

1. Ve a **Domain settings** en Netlify
2. Click en **"Add custom domain"**
3. Sigue las instrucciones para configurar tu DNS

---

## 🔄 Actualizaciones automáticas

Si conectaste con GitHub:

- Cada `git push` a la rama `main` desplegará automáticamente
- No necesitas hacer nada manual
- Los cambios estarán en línea en 2-3 minutos

---

## 💡 Recomendaciones finales

1. **Usa GitHub:** Es más fácil mantener y actualizar
2. **Protege tu API key:** Nunca la subas al código, solo en Netlify
3. **Monitorea el uso:** Google Gemini tiene límites de cuota gratuita
4. **Prueba localmente primero:** Usa `npm run dev` antes de desplegar

---

¿Necesitas ayuda? Contacta al desarrollador o revisa la [documentación de Netlify](https://docs.netlify.com).
