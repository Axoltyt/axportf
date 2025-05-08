const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
}

function createPopup() {
  const popup = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false, // Okno bez ramki
    alwaysOnTop: true, // Okno na wierzchu
    transparent: true, // Przezroczystość
    webPreferences: {
      nodeIntegration: true
    }
  });

  popup.loadURL('data:text/html,<html><body style="background-color: transparent; color: white; font-size: 20px; display: flex; align-items: center; justify-content: center;">Mogły KC</body></html>');

  // Losowe pozycje na ekranie
  const x = Math.random() * (screen.width - 200);
  const y = Math.random() * (screen.height - 100);
  popup.setBounds({ x: x, y: y, width: 200, height: 100 });
}

app.whenReady().then(() => {
  createWindow();

  // Tworzenie pop-upów po naciśnięciu spacji
  let popupCount = 0;
  const totalPopups = 20;

  app.on('browser-window-focus', () => {
    // Nasłuchujemy spacji
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.executeJavaScript(`
        window.addEventListener('keydown', (e) => {
          if (e.code === 'Space' && ${popupCount} < ${totalPopups}) {
            require('electron').ipcRenderer.send('create-popup');
            popupCount++;
          }
        });
      `);
    });
  });

  // Otwórz pop-up po kliknięciu spacji
  app.on('create-popup', createPopup);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
