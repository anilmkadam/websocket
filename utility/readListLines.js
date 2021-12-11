const fs = require('fs');
const readline = require('readline');
const Stream = require('stream');

exports.getLastLine = (fileName, minLength) => {
    let inStream = fs.createReadStream(fileName);
    let outStream = new Stream;
    return new Promise((resolve, reject)=> {
        let rl = readline.createInterface(inStream, outStream);
        let lineCount = 0;
        let lastLine = '';
        

        rl.on('line', function(line) {
            if (line == '' || line == require("os").EOL) {
                console.log('eof, last line is', lastLine);
                return;
            }
        
            lastLine = line;
        });

        //console.log(rl.cursor);
        rl.on('line', function (line) {
            console.log(rl.getCursorPos());
            if (lineCount <= minLength) {
                console.log(`${lineCount} line = ${line}.`);
                lastLine = line;
                lineCount++;
            }
        });

        rl.on('error', reject)

        rl.on('close', function () {
            resolve(lastLine)
        });
    })
}