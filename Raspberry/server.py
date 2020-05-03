import paramiko
import time
import sys

import socket



server_address = '127.0.0.1'
server_port = 5050

try: 
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) 
    server.bind((server_address,server_port))
    server.listen(1)
    print ("Socket successfully created")
except socket.error as err: 
    print ("socket creation failed with error %s" %(err) )



conn, addr = server.accept()
while True:
    cmd = input('>>')+'\n'

    conn.send(cmd.encode())

    message = conn.recv(1024)

    print(str(message.decode("utf-8") ))
    
    
    
    
