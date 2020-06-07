import socket

server_ip = '127.0.0.1'
mobile_port = 9010
server_port = 9000
msg = 'message from mobile'

mobile_server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
mobile_server_socket.bind(('', mobile_port))
print('Sending to server')
mobile_server_socket.sendto(bytes(msg, 'cp1250'), (server_ip, server_port))
print('Waiting from server response')
mobile_buff, mobile_address = mobile_server_socket.recvfrom(1024)
print('Got message: ' + str(mobile_buff, 'cp1250'))