import {INestApplication, Logger} from "@nestjs/common";
import io = require('socket.io');
import {JwtService} from "@nestjs/jwt";

export default async function initializeSocketIO(logger: Logger, app: INestApplication): Promise<void> {
    const socketIO = io(app.getHttpServer());
    const jwtService = app.get(JwtService);

    logger.setContext('SocketIO');

    socketIO.on('connection', (socket) => {
        logger.log(`Client connected, ID: ${socket.id}`);

        let token;
        let commands = '';
        let formattedCommands = '';

        socket.on('access_token', (tok) => {
            logger.log(`Client ${socket.id} authenticated with token: ${tok}`);
            token = tok;
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

                socket.emit('output', formattedCommands);
            }
        })

        socket.on('disconnect', () => {
            logger.log(`Client ${socket.id} disconnected`);
        });
    })

    logger.log(`SocketIO initialized`);
};