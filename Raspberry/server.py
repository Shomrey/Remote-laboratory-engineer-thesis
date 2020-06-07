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

