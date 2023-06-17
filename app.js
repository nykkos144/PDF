const { app, BrowserWindow, ipcMain } = require('electron');
const url = require("url");
const path = require("path");
const fs = require('fs');

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            webSecurity: false
        },
        frame: false
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/pdf-wiz/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    });
}

app.on('ready', createWindow);


app.whenReady().then(() => {

    ipcMain.on('close-window', () => {
        mainWindow.close();
    });
    ipcMain.on('minimize-window', () => {
        console.log(mainWindow.getPosition())
        mainWindow.minimize();
    });

    ipcMain.on('maximize-window', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });



    ipcMain.on('save-file', (event, { files }) => {
        console.log('save-file')
        console.log(files)

        const documentsPath = app.getPath('documents');
        const mainPath = path.join(documentsPath, 'PDFWiz');

        const folderName = generateRandomString(5);
        const folderPath = path.join(mainPath, folderName);

        if (!fs.existsSync(mainPath)) {
            fs.mkdirSync(mainPath);
        }
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        for (let file of files) {
            const filePath = path.join(folderPath, file.name);
            fs.writeFileSync(filePath, file.url);
        }

    });

})


function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
