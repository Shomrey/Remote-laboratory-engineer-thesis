import paramiko
import time
import sys

import select
import threading
import struct

import socket



#fake-switches connection setup
docker_address = str(sys.argv[1])
docker_port = str(sys.argv[2])
fake_switch_username='root'
fake_switch_password = 'root'
ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname=docker_address, port=docker_port, username=fake_switch_username,password=fake_switch_password)
device_connection = ssh_client.invoke_shell()
print('Connected to virtual device!')



#server connection setup
server_address = '127.0.0.1'
server_port = 5051

try: 
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    server.connect((server_address, server_port))
    print ("Socket successfully created")
except socket.error as err: 
    print ("socket creation failed with error %s" %(err) )


while True:
    read_list = [server, device_connection]
    read_ready, write_ready, err = select.select(read_list,[],[])
    for source in read_ready:
        if source == server:
            #send cmd to device
            print("----------------------------------------------------------------------")
            message = server.recv(1024)
            print("Received from server: "+  str(message.decode()))
            device_connection.send(message.encode(encoding='UTF-8'))
            print("Sent to device: "+  str(message.decode()))
        elif source == device_connection:
            #send msg to server
            print("----------------------------------------------------------------------")
            message = device_connection.recv(999)
            print("Received from device: "+  str(message.decode()))
            server.send(message)
            print("Sent to server: "+str(message.decode("utf-8") ))







  
ssh_client.close 
server.close