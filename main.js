const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Funkcja tworząca główne okno aplikacji
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Bez ramki okna
    transparent: true, // Przezroczyste okno
    alwaysOnTop: true, // Okno zawsze na wierzchu
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
}

// Funkcja tworząca okienka na ekranie
function createPopup() {
  const popup = new BrowserWindow({
    width: 150,
    height: 150,
    frame: false, // Bez ramki okna
    transparent: true, // Przezroczyste
    alwaysOnTop: true, // Okno na wierzchu
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Załaduj pustą stronę
  popup.loadURL('data:text/html,<html><body style="background: transparent;"></body></html>');

  // Losowanie pozycji na ekranie
  const x = Math.random() * (screen.width - 150);
  const y = Math.random() * (screen.height - 150);

  popup.setBounds({ x: x, y: y, width: 150, height: 150 });

  // Animacja latania okienka
  popup.setOpacity(0.8); // Ustawienie przezroczystości

  // Zamykanie okienka po kliknięciu
  popup.on('closed', () => {
    popup = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  // Nasłuchujemy na naciśnięcie spacji
  let popupCount = 0;
  const totalPopups = 20;

  // Po naciśnięciu spacji tworzymy okna
  ipcMain.on('create-popup', () => {
    if (popupCount < totalPopups) {
      createPopup();
      popupCount++;
    }
  });

  // Nasłuchujemy na spację
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          require('electron').ipcRenderer.send('create-popup');
        }
      });
    `);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
