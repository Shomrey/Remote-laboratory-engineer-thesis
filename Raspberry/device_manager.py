import serial
import time
import select
from threading import Thread
import socketio

sleep_time = 0.5

# fake-switches connection setup
ser = serial.Serial('/dev/ttyUSB0')
print('Connected to device!')

# server connection setup
server_address = 'https://remote-laboratory.herokuapp.com/'
sio = socketio.Client()
sio.connect(server_address)
sio.emit('identify_raspberry', 'malina_1')
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
    # send cmd from server to device
    print("-------------------------------------------------------")
    print("Received from server: " + str(data))
    cmd = str(data) + '\n\r'
    ser.write(str.encode(cmd))
    # ser.write(str.encode(data + '\r\n'))
    ser.reset_output_buffer()
    # device_connection.send(cmd.encode(encoding='UTF-8'))
    print("Sent to device: ")
    print(str.encode(cmd))


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
