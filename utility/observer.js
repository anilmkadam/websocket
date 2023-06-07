const EventEmitter = require("events").EventEmitter;
const fs = require("fs");
const FileUtility = require("./file_utility");

class Observer extends EventEmitter {
    
    constructor() {
        super();
    }

    async watchFile(fileName, maxReadLines = 1) {
        try {
            console.log(`[${new Date().toLocaleString()}] Watching for file changes on: ${fileName}`);
            const fileUtil = new FileUtility();
            fs.watchFile(fileName, {persistent: true }, async (currStat, prevStat) => {
                console.log(`[${new Date().toLocaleString()}] ${fileName} has been updated at ${currStat.mtime}.`);
                const logContent = await fileUtil.readLastNLines(fileName, maxReadLines);

                this.emit("log-received", { 
                    timestamp: new Date().toLocaleString(),
                    metadata: logContent 
                });
            });    
            const logContent = await fileUtil.readLastNLines(fileName, maxReadLines);

                this.emit("log-received", { 
                    timestamp: new Date().toLocaleString(),
                    metadata: logContent 
                });
        } catch(error) {
            console.log("Error occured => ", error.message);
            return Promise.reject(error);
        }
    }
}

module.exports = Observer;