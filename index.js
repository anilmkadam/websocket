const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const ws = require('ws');
const Observer = require("./utility/observer");
const fileName = './log/sample.log';
const maxReadLines = 10;
const observer = new Observer();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Hello Folks...."
    });
});

app.listen(3000, () => {
    console.log('Server started.');
    console.log('listening on 3000 port.....'); 
});

const wss = new ws.Server({ port: 8080, path: "/log" });
wss.on("connection", socket => {
    socket.on("message", message => {
        observer.on("log-received", log => {
            console.log(log);
            socket.send(log.metadata);
        });
        observer.watchFile(fileName, maxReadLines)
        .catch((err)=> {
            console.error(err);
            socket.send(err);
        });
    });
});

wss.on("error", err => {
    console.error(err);
})