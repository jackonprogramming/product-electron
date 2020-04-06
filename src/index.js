const { app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

if (process.env.Node_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}


let mainWindow
let newProductWindow
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
});

function createNewProductWindow() {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'add A New Product',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //newProductWindow.setMenu(null)
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new product.html'),
        protocol: 'file',
        slashes: true
    }))
    newProductWindow.on('closed', () => {
        newProductWindow = null;
    })
}

ipcMain.on('product:new', (e, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct)
    newProductWindow.close();
});

const templateMenu = [{
        label: 'File',
        submenu: [{
                label: 'New Product',
                accelerator: 'ctrl+N',
                click() {
                    createNewProductWindow();
                }
            },
            {
                label: 'remove All Products',
                //accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    mainWindow.webContents.send('products:remove-all');
                }
            },
            {
                label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }

];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    });
}

if (process.env.Node_ENV !== 'production') {
    templateMenu.push({
        label: 'Devtools',
        submenu: [{
            label: 'Show/Hide Dev Tools',
            accelerator: 'ctrl+D',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    })
}