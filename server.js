const http = require('http');
const url = require('url');
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

        if (path.pathname === '/COMP4537/labs/3/getDate/' && name) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(this.sendMessage(name));
            res.end();
        }
    }

    sendMessage(name) {
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

}

const myServer = new Server(8080);
