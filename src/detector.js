let configs = require('./configs');
let os = require('os');

function ifaceFilter() {
    let net = os.networkInterfaces();
    let interfaces = {};
    let filteredInterfaces = Object.keys(net).filter(item => item !== 'lo');
    filteredInterfaces.map(ifaceName => {
        let iface = net[ifaceName].filter(item => item.family == 'IPv4');
        if (!iface) return;
        iface = iface[0];
        interfaces[ifaceName] = iface;
    });
    process.send(interfaces);
}

setInterval(ifaceFilter, configs.pollingTime);