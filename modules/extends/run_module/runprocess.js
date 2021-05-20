const cp = require('child_process');

function terminal() {
    return new Promise((resolve, reject) => {

        switch (process.platform) {
            case "win32":
                cp.spawn('cmd', ['/C', 'start cmd.exe']); return resolve(true);
            case "darwin":
                cp.exec('open -a Terminal ' + process.env.HOME); return resolve(true);
            default:
                return resolve(false);
        }
        
    })
}

module.exports = terminal;