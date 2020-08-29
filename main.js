const { app, BrowserWindow } = require('electron')

let win;

function createWindow () {
  // Создаем окно браузера.
  win = new BrowserWindow({
    width: 300,
    height: 800,
    title: "Remanga reader",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    }
  })

// и загружаем index.html в приложении.
  win.loadFile('index.html')

  // Отображаем средства разработчика.
  // win.webContents.openDevTools()
}

// Этот метод будет вызван, когда Electron закончил
// инициализацию и готов для создания окон браузера.
// Некоторые интерфейсы API могут использоваться только после возникновения этого события.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. Можно также поместить их в отдельные файлы и применить к ним require.