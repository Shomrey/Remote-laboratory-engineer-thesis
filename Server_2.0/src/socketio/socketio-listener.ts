import {INestApplication, Logger} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Socket} from "socket.io";
import io = require('socket.io');

interface UserConnection {
    token: string;
    raspberryId: string;
    socket: Socket;
}

interface RaspberryConnection {
    id: string;
    socket: Socket;
    userToken: string;
}

type UserConnectionType = Record<string, UserConnection>;
type RaspberryConnectionType = Record<string, RaspberryConnection>;

export default async function initializeSocketIO(logger: Logger, app: INestApplication): Promise<void> {
    const socketIO = io(app.getHttpServer());
    const jwtService = app.get(JwtService);

    const users: UserConnectionType = {}
    const raspberries: RaspberryConnectionType = {}

    let adminSockets: Socket[] = [];

    logger.setContext('SocketIO');

    socketIO.on('connection', (socket) => {

        let userToken;  // mobile user
        let raspberryId;     // raspberry
        let admin = false;

        logger.log(`Device connected, ID: ${socket.id}`);

        /******************     mobile connection       ***************/

        socket.on('access_token', ({tok, raspberry_id}) => {
            logger.log(`Client ${socket.id} authenticated with token: ${tok} and requested to connect with raspberry: ${raspberry_id}`);
            userToken = tok;
            users[userToken] = {
                token: userToken,
                raspberryId: raspberry_id,
                socket
            }
            raspberries[raspberry_id].userToken = userToken;
            raspberries[raspberry_id].socket.emit('start_device');
        })

        socket.on('command', (command) => {
            if (!userToken) {
                logger.log(`Unauthenticated command from ${socket.id}`);
                socket.emit('re_auth');
            } else {
                logger.debug(`Command: ${command}`);

                const user = jwtService.decode(userToken);

                adminSockets.forEach(adminSocket => adminSocket.emit('spy', user['mail'] + ': ' + command))

                if (raspberries[users[userToken].raspberryId]) {
                    raspberries[users[userToken].raspberryId].socket.emit('output', command);
                } else {
                    socket.emit('output', 'Device disconnected. Please try again later.')
                }
            }
        })

        /******************     raspberry connection       *********************/

        socket.on('identify_raspberry', (rasp_id) => {
            raspberryId = rasp_id;
            logger.log(`Raspberry ${socket.id} authenticated with id: ${raspberryId}`);

            raspberries[raspberryId] = {
                id: raspberryId,
                socket,
                userToken: null
            }
        })

        socket.on('raspberry_message', (message) => {
            if (!raspberryId) {
                logger.log(`Unauthenticated command from ${socket.id}`);
            } else {
                logger.debug(`Command: ${message}`);

                users[raspberries[raspberryId].userToken].socket.emit('output', message)
            }
        })

        /******************     admin connection       *********************/
        socket.on('admin', () => {
            logger.log(`Admin connected, device ID: ${socket.id}`);
            adminSockets.push(socket);
            admin = true;
        });

        /******************     common      *************************/

        socket.on('disconnect', () => {
            logger.log(`Device ${socket.id} disconnected`);

            if (userToken) {
                if (raspberries[users[userToken].raspberryId]) {
                    raspberries[users[userToken].raspberryId].userToken = null;
                }
                delete users[userToken];
            } else if (raspberryId) {
                delete raspberries[raspberryId];
            } else if (admin) {
                adminSockets = adminSockets.filter(s => s.id !== socket.id);
            }
        });

        socket.on('available_raspberries', () => {
            const availableRaspberries = [];

            for (const raspberry in raspberries) {
                if (!raspberries[raspberry].userToken) {
                    availableRaspberries.push(raspberries[raspberry].id);
                }
            }

            socket.emit('available_raspberries', availableRaspberries);
        });
    })

    logger.log(`SocketIO initialized`);
};