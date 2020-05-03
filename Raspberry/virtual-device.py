import paramiko
import time
import sys

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
server_port = 5050

try: 
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    server.connect((server_address, server_port))
    print ("Socket successfully created")
except socket.error as err: 
    print ("socket creation failed with error %s" %(err) )




while True:

    try:         
            message = server.recv(1024)
            if message:
                cmd = message.decode()
                device_connection.send(cmd.encode(encoding='UTF-8'))
                time.sleep(1)
                res = device_connection.recv(999)
                server.send(res)
                print(str(res.decode("utf-8") ))
    except:
        continue

  
ssh_client.close 