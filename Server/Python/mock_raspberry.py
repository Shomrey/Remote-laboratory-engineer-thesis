import socket

server_ip = '127.0.0.1'
raspberry_port = 9011
server_port = 9000
msg = 'message from raspberry'

raspberry_server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
raspberry_server_socket.bind(('', raspberry_port))
print('Waiting for message from server')
raspberry_buff, raspberry_address = raspberry_server_socket.recvfrom(1024)
print('Message got: ' + str(raspberry_buff, 'cp1250'))
print('Sending message to server')
raspberry_server_socket.sendto(bytes(msg, 'cp1250'), (server_ip, server_port))
