// Modules to control application life and create native browser window
const {app, BrowserView, BrowserWindow, shell} = require('electron')
const windowStateKeeper = require('electron-window-state');
// const remote = require('remote')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.

  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });


  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webviewTag: true,
    frame:true,
    autoHideMenuBar: true
  });

  // let toolbar = new BrowserWindow({width: 800, height: 600});
  // toolbar.loadUrl("http://google.com");
  // toolbar.show();

  // and load the index.html of the app.
 // mainWindow.loadURL('https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail');
 mainWindow.loadFile('index.html');


  // let view = new BrowserView({
  //   webPreferences: {
  //     nodeIntegration: false
  //   },
  //   frame: false
  // })

  // mainWindow.setBrowserView(view)
  // // view.setBounds({ x: 0, y: 0, width: mainWindow.getSize()[0], height: mainWindow.getSize()[1] });

  // view.setBounds({ x: 0, y: 0, width: 300, height: 50 });
  // view.webContents.loadFile('index.html');

  mainWindowState.manage(mainWindow);





  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow.removeAllListeners('close');
    mainWindow.removeAllListeners('close');
    mainWindow = null
    app.quit()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // mainWindow.removeAllListeners('close');
  app.quit();

  if (process.platform !== 'darwin') {
    app.quit()
  }


})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


app.on('web-contents-created', (e, contents) => {

  // Check for a webview
  if (contents.getType() == 'webview') {

    // Listen for any new window events
    contents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
