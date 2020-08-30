import { INestApplication, Logger } from "@nestjs/common";
import io = require('socket.io');
import { JwtService } from "@nestjs/jwt";

export default async function initializeSocketIO(logger: Logger, app: INestApplication): Promise<void> {
    const socketIO = io(app.getHttpServer());
    const jwtService = app.get(JwtService);

    let connected_id = []
    let users = {}
    /*{token:{
        token: "value",
        raspberry_id: "raspberry_id",
        socket: "socket"
    }}*/
    let raspberries = {}
    /*{id:{
        id: "id",
        socket: "socket",
        user_token: "token"
    } }*/

    logger.setContext('SocketIO');

    socketIO.on('connection', (socket) => {

        let token;  // mobile user
        let id;     // raspberry
        let commands = '';
        let formattedCommands = '';

        logger.log(`Device connected, ID: ${socket.id}`);

        /******************     mobile connection       ***************/



        socket.on('access_token', (tok, raspberry_id) => {
            logger.log(`Client ${socket.id} authenticated with token: ${tok}`);
            token = tok;
            users[token] = {
                "token": token,
                "raspberry_id": raspberry_id,
                "socket": socket
            }
            raspberries[raspberry_id]["user_token"] = token;
            let raspberry_socket = raspberries[users[token]["raspberry_id"]];
            raspberry_socket.emit('start_device');
        })

        socket.on('command', (command) => {
            if (!token) {
                logger.log(`Unauthenticated command from ${socket.id}`);
            } else {
                logger.debug(`Command: ${command}`);

                const user = jwtService.decode(token);

                if (command === 'whoami') {
                    command = `${command}\n${JSON.stringify({
                        mail: user['mail'],
                        id: user['sub']
                    })}`;
                }

                commands = `${commands}${command}\n`;
                formattedCommands = `${formattedCommands}> ${command}\n`;

                let raspberry_socket = raspberries[users[token]["raspberry_id"]]
                raspberry_socket.emit('output', command);
            }
        })

        /******************     raspberry connection       *********************/

        socket.on('identify_raspberry', (rasp_id) => {
            id = rasp_id;
            logger.log(`Raspberry ${socket.id} authenticated with id: ${id}`);

            raspberries[id] = {
                "id": id,
                "socket": socket
            }
        })

        socket.on('raspberry_message', (message) => {
            if (!id) {
                logger.log(`Unauthenticated command from ${socket.id}`);
            } else {
                logger.debug(`Command: ${message}`);


                formattedCommands = `${formattedCommands} ${message}\n`;


                let user_socket = users[raspberries[id]["user_token"]]
                user_socket.emit('output', formattedCommands)

            }
        })

        /******************     common      *************************/

        socket.on('disconnect', () => {
            logger.log(`Device ${socket.id} disconnected`);
        });
    })

    logger.log(`SocketIO initialized`);
};