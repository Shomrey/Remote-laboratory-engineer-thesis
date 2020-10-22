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
server_address = 'http://0.0.0.0:5000'
sio = socketio.Client()
sio.connect(server_address)
sio.emit('identify_raspberry', 'malina_1')
print('Connected to server!')



@sio.on('output')
def on_command(data):
     # send cmd from server to device
    print("----------------------------------------------------------------------")
    print("Received from server: "+  str(data))
    cmd = str(data)+'\n'
    device_connection.send(cmd.encode(encoding='UTF-8'))
    print("Sent to device: "+str(data))




@sio.on('start_device')
def on_start_device():
    print("Starting device")
    thread = Thread(target = listen_device_thread, args = (sio, device_connection))
    thread.start()



def listen_device_thread(server, device):

    while True:
        
        read_list = [device]
        read_ready, write_ready, err = select.select(read_list,[],[])
        for source in read_ready:
            if source == device:
                # send cmd from device to server
                print("----------------------------------------------------------------------")
                time.sleep(2)
                message = device_connection.recv(1024)
                print("Received from device: "+  str(message.decode()))
                server.emit('raspberry_message',  str(message.decode()))
                print("Sent to server: "+str(message.decode("utf-8") ))
        

        



