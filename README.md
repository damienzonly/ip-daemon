# IP Daemon
A simple network interfaces detector that notifies ip changes via email.
The daemon will email you in case:
* one of the network cards goes down
* a new network card goes up
* one of your interfaces changed ip 

At now the script supports only gmail as mail service. To enable the script to send mail you need to allow the less secure apps on the sender account with **[this link](https://myaccount.google.com/lesssecureapps)**

## Requirements
* NodeJS v11.4.0
* npm v6.7.0
* git 2.19.2
* systemctl

## Download
```bash
cd myDevFolder
git clone https://github.com/damienzonly/ip-daemon.git
```

#### Configure the daemon
```java
module.exports = {
    // Custom id that will be sent in the email as identifier of the machine
    machineID: "Ubuntu-office",
    // A child process will check every {{pollingTime}} milliseconds the network cards
    pollingTime: 3000,
    // Subnet mask, is the number of octects of your subnet, 3 means /24
    mask: 3,
    // Recipients of the notification
    destinations: [
        "email1@...com",
        "email2@...com",
        "..."
        ],
    sender: {
        email: "sender email",
        password: "senderpassword"
    },
    // the json file that the daemon will use to store network card informations in case of system reboot etc.
    saveFile: "netconf.json",
    // logfile of the whole script
    logfile: "ip-daemon.log"
}
```
#### Install
```bash
cd ip-daemon
sudo bash install.sh
```

The whole codebase will be installed in ```/opt/ip-daemon``` where you can also fin the log file specified in the ```configs.js```

###### That's it!