const http = require('http');// require is used to import in NodeJS. It provides some functionality
const app = require('./app');
const port = process.env.PORT || 3000;// either thr an env variable or a hardcode 3000 
const server = http.createServer(app);

server.listen(port);