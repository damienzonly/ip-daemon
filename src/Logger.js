let fs = require('fs');
class Logger {
    /**
     * @param {object} conf Configutarion object
     * @param {string} conf.logfile File name of the log file, example "logfile.log"
     * @param {number} conf.mode 
     *      __0__: no log, 
     *      __1__: log only to file, 
     *      __2__: log only on console, 
     *      __3__: log on both file and console
     * @param {boolean} conf.prefix Choose to print a date/timestamp as line prefix 
     * @param {("date"|"ts")} conf.dateType Choose if logging a human readable date or a timestamp at the beginning of the line
     */
    constructor({logfile, mode, prefix, dateType}) {
        this.logfile = logfile||"loggerfile.log";
        this.mode = mode||3;
        this.prefix = prefix||true;
        this.dateType = dateType||"date";
    }

    
    log (message) {
        if (this.mode > 3 || this.mode < 0) throw new Error(`Cannot log with mode ${this.mode}`);
        let logBuiltMessage = [message, '\n'], today;
        if (this.prefix) {
            if (this.dateType == "date") today = new Date().toLocaleString();
            if (this.dateType == "ts") today = Date.now();
            logBuiltMessage = [today, ' - ', ...logBuiltMessage]
        }
        if (this.mode == 3 || this.mode == 1) {
            if (!fs.existsSync(this.logfile)) fs.writeFileSync(this.logfile, '');
            fs.appendFile(this.logfile, logBuiltMessage.join(''), err => {
                if (err) console.log(err)
            });
        }
        if (this.mode == 3 || this.mode == 2) console.log(logBuiltMessage.slice(0, logBuiltMessage.length-1).join(''));
    }
}

module.exports = Logger