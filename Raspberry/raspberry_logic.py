import paramiko
import time
import sys



import select
import threading
from threading import Thread
import struct

import socketio


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
server = 'https://remote-laboratory.herokuapp.com'
sio = socketio.Client()
sio.connect(server)
sio.emit('identify_raspberry', {'id':'malina_1'})


@sio.on('server_ack')
def on_server_ack(data):
    print("Server initialized connection with: "+ str(data))


@sio.on('command')
def on_command(data):
     # send cmd from server to device
    print("----------------------------------------------------------------------")
    print("Received from server: "+  str(data))
    device_connection.send(data)
    print("Sent to device: "+str(data))


def listen_device_thread(server, device):

    while True:
        read_list = [device]
        read_ready, write_ready, err = select.select(read_list,[],[])
        for source in read_ready:
            if source == device:
                # send cmd from device to server
                print("----------------------------------------------------------------------")
                message = device_connection.recv(999)
                print("Received from device: "+  str(message.decode()))
                server.emit('command', {'cmd' : str(message.decode())})
                print("Sent to server: "+str(message.decode("utf-8") ))

        


thread = Thread(target = listen_device_thread, args = (sio, device_connection))
thread.start()

  
ssh_client.close 
