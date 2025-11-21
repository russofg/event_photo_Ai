import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Cambiar a true para eventos en modo kiosco
    frame: true, // Cambiar a false para quitar barra de título
    icon: path.join(__dirname, "../build/icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // En desarrollo: cargar desde Vite (puerto 5173)
  if (process.env.NODE_ENV === "development" || !app.isPackaged) {
    mainWindow.loadURL("http://localhost:5173").catch((err) => {
      console.error("Error cargando desde Vite:", err);
      console.log('Asegúrate de que Vite esté corriendo con "npm run dev"');
    });
    mainWindow.webContents.openDevTools();
  } else {
    // En producción: cargar desde carpeta dist
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Atajo para cerrar la app (Ctrl+Q)
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.key.toLowerCase() === "q") {
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
