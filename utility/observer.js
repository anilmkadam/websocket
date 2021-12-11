const chokidar = require("chokidar");
const readLastLines = require("read-last-lines");
const EventEmitter = require("events").EventEmitter;
//const getLastLine = require("./readListLines").getLastLine;
const fs = require("fs");

class Observer extends EventEmitter {
    constructor() {
        super();
    }

    watchFile(fileName, maxReadLines = 1) {
        return new Promise((resolve, reject) => {
            try {
                console.log(
                    `[${new Date().toLocaleString()}] Watching for file changes on: ${fileName}`
                  );

                //const watcher = chokidar.watch(fileName, { persistent: true });
                const watcher = fs.watchfile(fileName, {persistent: true },
                    async (currStat, prevStat) => {
                        console.log(
                            `[${new Date().toLocaleString()}] ${fileName} has been updated at ${currStat.mtime}.`
                          );
                        
                        const logContent = await readLastLines.read(fileName, maxReadLines);
                        this.emit("log-received", { 
                            timestamp: new Date().toLocaleString(),
                            metadata: logContent 
                        });
                    });

                // watcher.on("all", async (event, filePath) => {
                //     console.log(
                //         `[${new Date().toLocaleString()}] ${filePath} has been updated.`
                //       );
                    
                //     //const logContent = await readLastLines.read(filePath, maxReadLines);
                //     const logContent = await getLastLine(fileName, 10);
                //     this.emit("log-received", { 
                //         timestamp: new Date().toLocaleString(),
                //         metadata: logContent 
                //     });
                // });

            } catch(error) {
                console.log("Error occured => ", error.message);
                reject(error);
            }
        });
    }
}

module.exports = Observer;