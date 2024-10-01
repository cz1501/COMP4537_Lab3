const http = require('http');
const url = require('url');
const fs = require('fs');
const messages = require('./lang/messages/en/users.js');   
const utils = require('./modules/utils.js'); 


class Server {
    constructor(port) {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        }).listen(port, () => {
            console.log(`Server running at port ${port}`);
        });
    }

    handleRequest(req, res) {
        const path = url.parse(req.url, true);
        const name = path.query.name;
        const text = path.query.text;

        if (path.pathname === '/COMP4537/labs/3/getDate/' && name) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(this.sendGreeting(name));
            res.end();
        }

        if (path.pathname === '/COMP4537/labs/3/writeFile/' && text) {
            const fileWriter = new FileWriter();
            fileWriter.writeToFile(text);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(this.sendFileWriteResponse(text));
            res.end();
        }

        if (path.pathname === '/COMP4537/labs/3/readFile/file.txt') {
            const fileWriter = new FileWriter();
            fileWriter.readFromFile().then( message => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(this.sendFileReadResponse(message));
                res.end();
            }).catch( error => {
                res.writeHead(500, {'Content-Type': 'text/html'});
                res.write(`<p>${err.message}</p>`);
                res.end();
            })
        }
    }

    sendGreeting(name) {
        let message = messages.greeting.replace('%1', name) + ' ' + utils.getDate();

        return `
        <html>
            <head>
                <title>Server Date</title>
            </head>
            <body>
                <p style='color:blue;'>${message}</p>
            </body>
        </html>
        `;
    }

    sendFileWriteResponse(text) {
        let message = messages.fileWriteSuccess.replace('%1', text);

        return `
        <html>
            <head>
                <title>Write File</title>
            </head>
            <body>
                <p style='color:blue;'>${message}</p>
            </body>
        </html>
        `;
    }

    sendFileReadResponse(message) {
        return `
        <html>
            <head>
                <title>Read File</title>
            </head>
            <body>
                <p style='color:blue;'>${message}</p>
            </body>
        </html>
        `;
    }

}

class FileWriter {
    constructor() {
    }

    writeToFile(text) {
        fs.appendFile('text.txt', text, (err) => {
            if (err) throw err;
        });
    }

    readFromFile() {
        return new Promise((resolve, reject) => {
            fs.readFile('text.txt', 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}   


const myServer = new Server(8080);
