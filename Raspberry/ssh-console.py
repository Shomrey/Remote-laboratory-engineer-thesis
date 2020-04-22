import paramiko
import time

ip_address = '127.0.0.1'
username='root'
password = 'root'
ssh_client = paramiko.SSHClient()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh_client.connect(hostname=ip_address, port='32769',username=username,password=password)

print('Successful connection!')


remote_connection = ssh_client.invoke_shell()

while True:

    ress = 'switch>'
    cmd = input(ress+' ')+'\n'
    remote_connection.send(cmd.encode(encoding='UTF-8'))
    time.sleep(1)
    res = remote_connection.recv(999)
    print(str(res.decode("utf-8") ))
    
ssh_client.close 