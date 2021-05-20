const {app, BrowserWindow, ipcMain, globalShortcut, Menu, Tray} = require('electron');
const electron = require('electron');
const electronLocalShortcut = require('electron-localshortcut');
const module_manager = require(__dirname+'/modules/module_manager');

let bar;
let hided = true;
let tray = null;
let traylist;
let app_size;

function init() {
    console.log("어플리케이션 로드 단계");
    app_size = {
        screen: {
            width: electron.screen.getPrimaryDisplay().workAreaSize.width,
            height: electron.screen.getPrimaryDisplay().workAreaSize.height
        },
        default: {
            width: parseInt(electron.screen.getPrimaryDisplay().workAreaSize.width/100*65),
            height: parseInt(electron.screen.getPrimaryDisplay().workAreaSize.height/100*7)
        },
        new: {

        }
    }

    bar = new BrowserWindow({
        width: app_size.default.width,
        height: app_size.default.height,
        webPreferences: {
          nodeIntegration: true
        },
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        show: false,
        skipTaskbar: true,
        setVisibleOnAllWorkspaces: true,
        // resizable: false
    });
    bar.on('blur', hide_bar);


    traySetup();
    platformSetup();
    module_manager.init();

    bar.loadFile(`${__dirname}/Front/index.html`);
    bar.center();
    let centerpos = bar.getPosition();
    bar.setPosition(centerpos[0], parseInt(centerpos[1]-(centerpos[1]/100*30)));
    show_bar();
    console.log("어플리케이션 로드 완료");
}


function updateClip(data) {
    unfoldClip();
    if (data.err) bar.webContents.send("clipUpdate", {type: 'list', data:[{title: `${data.modulename} 에서 오류가 발생했습니다.`, desc: data.err}]});
    
    // console.log(data)
    bar.webContents.send("clipUpdate", data);
}

function foldClip() {
    bar.setContentSize(app_size.default.width, app_size.default.height);
    bar.webContents.send("fold", app_size);
}

function unfoldClip() {
    bar.webContents.send("unfold", app_size);
}

function traySetup() {
    console.log("System 트레이 설정 단계");
    tray = new Tray(__dirname+'/Front/icon.png');
    traylist = Menu.buildFromTemplate([
        { label: 'WindowHelper', type: 'normal', enabled: false},
        { label: 'sep', type: 'separator' },
        { label: '열기', type: 'normal', click: show_bar },
        { label: '종료', type: 'normal', click: () => {bar.close()}},
    ]);
    tray.setToolTip('This is my application');
    tray.setContextMenu(traylist);

    tray.on("double-click", show_bar);
}

function platformSetup() {
    console.log("단축키 설정 단계, 실행중인 플랫폼:", process.platform);
    switch (process.platform) {
        case "win32":   // For Windows Platform
            globalShortcut.register("Ctrl+Tab", () => {
                if (hided)
                    show_bar();
                else
                    hide_bar();
            });
            break;
        case "darwin":  // For MacOS Platform
            bar.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
            app.dock.hide();
            globalShortcut.register("Option+Space", () => {
                if (hided)
                    show_bar();
                else
                    hide_bar();
            });
            break;
        default:
            console.log("실행중인 시스템 환경이 지원되지 않습니다.");
            process.exit(1);
            break;
    }


    electronLocalShortcut.register(bar, 'Esc', hide_bar);
}

function hide_bar() {
    if (hided) return;
    bar.hide();
    bar.blur();
    foldClip();
    hided = true;
    bar.webContents.send("hide_bar", true);
}

function show_bar() {
    if (!hided) return;
    bar.show();
    bar.focus();
    hided = false;
    bar.webContents.send("show_bar", true);
}


ipcMain.on("hide_bar", hide_bar);
ipcMain.on("keyinput", (event, str) => {
    // 실시간 키 입력에 대한 피드백
});

ipcMain.on("bodyResize", (event, height) => {
    // console.log(height);
    app_size.new.height = height;
    bar.setContentSize(app_size.default.width, height);
});


ipcMain.on("command", (event, Data) => {
    if (Data == "exit" || Data == "종료") return bar.close();
    // if (Data == "open") unfoldClip();
    // if (Data == "close") foldClip();
    module_manager.search(Data).then(result => {
        updateClip(result);
    });
    // search_module(Data).then(result => {
    //     updateClip(result);
    // });
});

app.on('ready', init);