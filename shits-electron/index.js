const { app, BrowserWindow } = require('electron');

function createWindows() {
    let appWindow = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        minWidth: 800,
        minHeight: 600,
        show: false
    });
    appWindow.loadFile('./index.html');
    
    appWindow.on('closed', ()=> {
        appWindow = null;
    });
    appWindow.once('ready-to-show', ()=> {
        appWindow.show();
        appWindow.maximize();
    });
}

app.on('ready', createWindows);

