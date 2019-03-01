module.exports = {
    // polling time in milliseconds
    machineID: "",
    pollingTime: 3000,
    // Subnet mask
    mask: 3,
    destinations: ["",""],
    sender: {
        email: "",
        password: ""
    },
    saveFile: "netconf.json",
    logfile: "ip-daemon.log"
}