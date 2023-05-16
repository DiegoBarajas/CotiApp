const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    title: 'CotiApp',
    autoHideMenuBar: true,
    icon: './src/assets/cotiapp-icono-t.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  mainWindow.webContents.setZoomFactor(0.7);
  //mainWindow.loadURL('https://cotiapp.vercel.app/');
  mainWindow.loadURL('http://localhost:3000');

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})