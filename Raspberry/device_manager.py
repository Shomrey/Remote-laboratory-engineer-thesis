import serial
import time
import select
import sys
from threading import Thread
import socketio

sleep_time = 0.5
device = str(sys.argv[1])
device_id = str(sys.argv[2])
server_address = str(sys.argv[3])

# fake-switches connection setup
ser = serial.Serial('/dev/'+device)
print('Connected to device!')

# server connection setup
sio = socketio.Client()
sio.connect(server_address)
sio.emit('identify_raspberry', device_id)
print('Connected to server!')


def get_message(source):
    ready_to_read = source.inWaiting()
    time.sleep(sleep_time)
    while source.inWaiting() > ready_to_read:
        ready_to_read = source.inWaiting()
        time.sleep(sleep_time)
        print("reading...")
    result = source.read(source.inWaiting())
    source.reset_input_buffer()
    return result


@sio.on('output')
def on_command(data):
    print("-------------------------------------------------------")
    print("Received from server: " + str(data))
    cmd = str(data) + '\n\r'
    ser.write(str.encode(cmd))
    ser.reset_output_buffer()
    print("Sent to device: " + str(str.encode(cmd)))


@sio.on('start_device')
def on_start_device():
    print("Starting device")
    thread = Thread(target=listen_device_thread, args=(sio, ser))
    thread.start()


def listen_device_thread(server, device):
    while True:
        read_list = [device]
        read_ready, write_ready, err = select.select(read_list, [], [])
        for source in read_ready:
            if source == device:
                # send cmd from device to server
                print("-------------------------------------------------------")
                message = get_message(device)
                print("Received from device: " + str(message.decode()))
                server.emit('raspberry_message', str(message.decode()))
                print("Sent to server: " + str(message.decode("utf-8")))
