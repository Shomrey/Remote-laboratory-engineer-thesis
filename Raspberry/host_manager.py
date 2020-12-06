import sys
import socketio
import subprocess

device_id = str(sys.argv[1])
server_address = str(sys.argv[2])

sio = socketio.Client()
sio.connect(server_address)
sio.emit('identify_raspberry', device_id)
print('Connected to server!')


@sio.on('output')
def on_command(data):
    print("-------------------------------------------------------")
    print("Cmd: " + str(data))
    commands = data.rstrip().split()

    result = subprocess.run(commands, stdout=subprocess.PIPE)
    result = result.stdout.decode('utf-8')
    print("Result: \n" + result),
    sio.emit('raspberry_message', str(result))


@sio.on('start_device')
def on_start_device():
    print("Starting host ...")
