const fs = require('mz/fs');

class FileUtility {
    async readLastNLines(filePath, maxLine) {
        const self = {
            stat: null,
            file: null
        };
        
        try {
            const isFileExists = await fs.exists(filePath);
            if (!isFileExists) {
                throw new Error("File does not exist");
            }

            await Promise.all([fs.stat(filePath).then(function (stat) {
                return self.stat = stat;
            }), 
            fs.open(filePath, "r").then(function (file) {
                return self.file = file;
            })]);
            let chars = 0, lineCount = 0;
            let lines = "";
            const newLineCharacters = ['\n', '\r'];
            while(true) {
                if(lines.length >= self.stat.size || lineCount >= maxLine) {		
                    fs.close(self.file);
                    return lines;
                }
                const [_, buffer] = await fs.read(self.file, Buffer.alloc(1), 0, 1, self.stat.size - 1 - chars);
                var nextCharacter = String.fromCharCode(buffer[0]);
                lines = nextCharacter + lines;
                var pos =  newLineCharacters.indexOf(nextCharacter);
                if (pos >= 0 && lines.length > 1) {
                    lineCount++;
                }
                chars++;
            }

        } catch(error) {
            if (self.file !== null) {
                fs.close(self.file);
            }
             throw error;
        }
    }
}

module.exports = FileUtility;