import socket
import threading
from flask import Flask, request, jsonify
from flask_api import status
from flask_cors import CORS, cross_origin
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
CORS(app)


@app.route('/user/register', methods=['POST'])
def register_user():
    content = request.get_json()
    # TODO content validation
    # TODO hash the password
    if database.add_user(content['name'], content['surname'],
                         content['mail'], content['password'], content['user_type']):
        return 'Registered succesfully', status.HTTP_200_OK
    else:
        return 'Failed to register', status.HTTP_400_BAD_REQUEST


@app.route('/user/login', methods=['POST'])
def login():
    content = request.get_json()
    print('Login request', content)
    # TODO content validation
    # TODO hash the password
    if database.validate_user(content['mail'], content['password']):
        return 'Login succesful', status.HTTP_200_OK
    else:
        return 'Failed to log in', status.HTTP_401_UNAUTHORIZED


@app.route('/user/<user_id>/labs')
def get_user_labs(user_id):
    if request.args.get('type') == 'teacher':
        return jsonify(database.get_teacher_labs(user_id))
    else:
        return jsonify(database.get_labs_for_student(user_id))


@app.route('/user/<user_id>/labs', methods=['POST'])
def add_lab():
    content = request.get_json()
    # TODO content validation
    if database.add_laboratory(content['date'], content['duration'], content['title'], content['configuration'],
                               content['description'], content['topology'], content['max_students'], content['teacher']):
        return 'Lab added succesfully', status.HTTP_200_OK
    else:
        return 'Failed to add lab', status.HTTP_400_BAD_REQUEST
