const cluster = require('cluster');
const os = require('os');
const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const logRequest = require('./middlewares/logger.cjs');
const { UserController } = require('./controllers/User.cjs');
const { ConfirmCodeController } = require('./controllers/ComfirmCode.cjs');
const User = require('./routes/user.cjs');
const config = require('./config.cjs');

const PORT = config.serverPort;
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        console.log('New WebSocket connection');
        ws.on('message', (message) => {
            if (Buffer.isBuffer(message)) {
                message = message.toString('utf8');
            }
            console.log(message);
            const req = JSON.parse(message);
            switch (req.className) {
                case 'authenticate':
                    if (req.data.token) {
                        jwt.verify(req.data.token, config.jwtSecret, (err, decoded) => {
                            if (err) {
                                console.log('Invalid token');
                                ws.send(JSON.stringify({ className: 'authenticate', error: 'Invalid token' }));
                            } else {
                                console.log('User is authorized');
                                ws.send(JSON.stringify({ className: 'authenticate', token: true }));
                            }
                        });
                    }
                    break;
                case 'user':
                    new UserController(ws, JSON.parse(message)).WebSocketInput();
                    break;
                case 'comfirm-code':
                    new ConfirmCodeController(ws, JSON.parse(message)).WebSocketInput();
                    break;
                default:
                    break;
            }
        });
        ws.send('Welcome to the WebSocket server!');
        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    app.get('/', (req, res) => {
        res.send('WebSocket Server is running');
    });

    app.use(cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));
    app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 1000000 }));
    app.use(express.json());
    app.use((req, res, next) => {
        res.header('Content-Type', 'application/json; charset=UTF-8');
        next();
    });
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Что-то вызвало ошибку на стороне сервера!');
    });

    app.use(logRequest);
    app.use(User);

    server.listen(PORT, () => {
        console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
    });

    const router = express.Router();
    module.exports = { router, app, wss };
}