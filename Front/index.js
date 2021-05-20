// const { ipcRenderer } = require("electron");

function hide_bar() {
    ipcRenderer.send("hide_bar", true);
}

// setInterval(() => {
//     ipcRenderer.send("bodySize", document.body.offsetHeight);
// }, 100);