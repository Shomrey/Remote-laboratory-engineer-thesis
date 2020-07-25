import socket
import threading
from flask import Flask, request, jsonify, Response
from flask_api import status
from flask_cors import CORS, cross_origin
import database
import jwt


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

    # mobile_server_socket.bind(('', mobile_port))
    # raspberry_server_socket.bind(('', raspberry_port))

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
    # TODO content validation
    # TODO hash the password
    user_id = database.validate_user(content['mail'], content['password'])
    if user_id is None:
        return 'Failed to log in', status.HTTP_401_UNAUTHORIZED
    else:
        response = Response('Login succesful')

        # required for testing in chrome
        response.headers['Access-Control-Expose-Headers'] = 'auth-token'

        response.headers['auth-token'] = jwt.encode(
            {'id': user_id}, 'secret', algorithm='HS256')
        return response


@app.route('/user/labs')
def get_user_labs():
    try:
        user_id = validate_token(request.headers['auth-token'])
    except jwt.InvalidSignatureError:
        return 'Unauthorized access', status.HTTP_401_UNAUTHORIZED
    if request.args.get('type') == 'teacher':
        lab_rows = database.get_teacher_labs(user_id)
        return jsonify(rows_to_labs(lab_rows))
    else:
        lab_rows = database.get_labs_for_student(user_id)
        return jsonify(rows_to_labs(lab_rows))


@app.route('/user/labs', methods=['POST'])
def add_lab():
    content = request.get_json()
    # TODO content validation
    if database.add_laboratory(content['date'], content['duration'], content['title'], content['configuration'],
                               content['description'], content['topology'], content['max_students'], content['teacher']):
        return 'Lab added succesfully', status.HTTP_200_OK
    else:
        return 'Failed to add lab', status.HTTP_400_BAD_REQUEST


def validate_token(token: str):
    return jwt.decode(token, 'secret', algorithms=['HS256'])['id']


def rows_to_labs(rows):
    labs = []
    for row in rows:
        labs.append({'id': row['id'], 'date': row['date'],
                     'duration': row['duration'], 'title': row['title'],
                     'configuration': row['configuration'], 'description': row['description'],
                     'tasks': row['tasks'], 'teacher': row['name'] + ' ' + row['surname']})
    return labs
