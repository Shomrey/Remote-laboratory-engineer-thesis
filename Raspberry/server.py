#This is script for testing virtual-device.py program.
#It simply connects to client and allows user to enter commands.

import time
import sys
import socket

import select
import threading
import struct


server_address = '127.0.0.1'
server_port = 5051

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
    read_list=[conn, sys.stdin]
    read_ready, write_ready, err = select.select(read_list,[],[])
    for source in read_ready:
        if source == sys.stdin:
            message = sys.stdin.readline()
            conn.send(message.encode())
        elif source == conn:
            message = conn.recv(1024)
            print(str(message.decode("utf-8") ))


# while True:
#     #enter command
#     cmd = input('>>')+'\n'
#     #send command to client(Raspberry)
#     conn.send(cmd.encode())
#     #read&print result message after executing command
#     message = conn.recv(1024)
#     print(str(message.decode("utf-8") ))
    
    
    
# while True:
#     read_list = [server, device_connection]
#     read_ready, write_ready, err = select.select(read_list,[],[])
#     for source in read_ready:
#         if source == server:
#             #send cmd to device
#             print("----------------------------------------------------------------------")
#             message = server.recv(1024)
#             print("Received from server: "+  str(message.decode()))
#             device_connection.send(message.encode(encoding='UTF-8'))
#             print("Sent to device: "+  str(message.decode()))
#         elif source == device_connection:
#             #send msg to server
#             print("----------------------------------------------------------------------")
#             message = device_connection.recv(999)
#             print("Received from device: "+  str(message.decode()))
#             server.send(message)
#             print("Sent to server: "+str(message.decode("utf-8") ))

    
