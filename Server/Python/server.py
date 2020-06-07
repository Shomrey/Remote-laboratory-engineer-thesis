import socket

def run_server():
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

    while True:
        mobile_buff, mobile_address = response_socket.recvfrom(1024)

        response_socket.sendto(bytes(str(mobile_buff, 'cp1250'), 'cp1250'), (server_ip, raspberry_port))

        raspberry_buff, raspberry_address = response_socket.recvfrom(1024)

        response_socket.sendto(bytes(str(raspberry_buff, 'cp1250'), 'cp1250'), (server_ip, mobile_port))


run_server()




