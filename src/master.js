let configs = require('./configs');
let fs = require('fs');
let cproc = require('child_process');
let child = cproc.fork("./detector.js");
let sendEmail = require("./mailer");
let os = require('os');
let Logger = require('./Logger');
let masterLogger = new Logger({
    logfile: configs.logfile,
    mode: 3,
    prefix: true,
    dateType: "date"
});


// generate network cards file if doesn't exist
fs.appendFileSync(configs.saveFile, "");
masterLogger.log("ip-daemon started");

let emailPayloadPrefix = `
Machine ID: ${configs.machineID}
hostname: ${os.hostname()}
username: ${os.userInfo()["username"]}
`

function detect(receivedNet) {
    let fileNet = (fs.statSync("./" + configs.saveFile).size >= 2) ? require('./' + configs.saveFile) : {};
    let missing = Object.keys(fileNet).filter(k => (!(k in receivedNet)));
    let oldIfaces = {};
    for (const ifaceName of Object.keys(receivedNet)) {
        let oldIP = fileNet[ifaceName];
        let newIP = receivedNet[ifaceName].address;
        let emailSuffix = `\nOld IP: ${oldIP}\nNew IP: ${newIP}\n
        `
        // if interface existing in the file
        if (ifaceName in fileNet) {
            // if interface changed
            if (oldIP !== newIP) {
                oldIfaces[ifaceName] = oldIP["address"];
                oldIfaces[ifaceName] = oldIP;
                fileNet[ifaceName] = newIP["address"];
                masterLogger.log(`Changed: ${ifaceName} from ${oldIP} to ${newIP}`);
                // updating file
                fileNet[ifaceName] = newIP;
                sendEmail(`[ip-daemon] New IP for ${configs.machineID}`, emailPayloadPrefix + emailSuffix);
            }
        }
        // new incoming interface detected, add it to file
        else {
            masterLogger.log(`Adding new interface detected form child: ${ifaceName}`);
            fileNet[ifaceName] = newIP;
            sendEmail(`[ip-daemon] New interface detected on ${configs.machineID}`, emailPayloadPrefix + emailSuffix);
        }

        for (const missingFromNew of missing) {
            delete fileNet[missingFromNew];
            masterLogger.log(`Interface ${missingFromNew} is down`);
            sendEmail(`[ip-daemon] IFace down: ${missingFromNew}`, emailPayloadPrefix + emailSuffix);

        }
        fs.writeFileSync(configs.saveFile, JSON.stringify(fileNet, null, 4));
    }
}


child.on("message", message => detect(message));