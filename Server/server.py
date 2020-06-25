import socket
import threading
from flask import Flask, request
from flask_api import status
import database


def run_socket_server():
    server_ip = '127.0.0.1'
    mobile_port = 9010
    raspberry_port = 9011
    response_port = 9000
    mobile_buff = []
    raspberry_buff = []

    mobile_server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    raspberry_server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    response_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    response_socket.bind(('', response_port))

    #mobile_server_socket.bind(('', mobile_port))
    #raspberry_server_socket.bind(('', raspberry_port))

    print('Server started, listening on', server_ip)
    print('Ports:')
    print('- mobile:', mobile_port)
    print('- raspberry:', raspberry_port)
    print('- response:', response_port)

    while True:
        mobile_buff, mobile_address = response_socket.recvfrom(1024)

        response_socket.sendto(
            bytes(str(mobile_buff, 'cp1250'), 'cp1250'), (server_ip, raspberry_port))

        raspberry_buff, raspberry_address = response_socket.recvfrom(1024)

        response_socket.sendto(
            bytes(str(raspberry_buff, 'cp1250'), 'cp1250'), (server_ip, mobile_port))


database.create_tables()

socketServerThread = threading.Thread(target=run_socket_server)
socketServerThread.start()

app = Flask(__name__)


@app.route('/user/register', methods=['POST'])
def register_user():
    content = request.get_json()
    # TODO content validation
    if database.add_student(content['name'], content['surname'],
                            content['mail'], content['password']):  # TODO hash the password
        return 'Registered succesfully', status.HTTP_200_OK
    else:
        return 'Failed to register', status.HTTP_400_BAD_REQUEST

@app.route('/user/login', methods=['POST'])
def login():
    content = request.get_json()
    # TODO content validation
    if database.validate_student(content['mail'], content['password']):  # TODO hash the password
        return 'Login succesful', status.HTTP_200_OK
    else:
        return 'Failed to log in', status.HTTP_400_BAD_REQUEST
