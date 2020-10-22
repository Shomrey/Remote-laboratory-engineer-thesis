import sys
from threading import Thread
import select

import eventlet
import socketio

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})


@sio.on('identify_raspberry')
def on_identify_raspberry(data, data2):
    print("Raspberry identified: " + str(data))
    sio.emit('start_device')


@sio.on('raspberry_message')
def on_raspberry_message(data, data2):
    print("Received raspberry response: " + str(data2))
    sio.emit('output', 'enable')


eventlet.wsgi.server(eventlet.listen(('', 5000)), app)

while True:
    read_list = [sys.stdin]
    read_ready, write_ready, err = select.select(read_list, [], [])
    for source in read_ready:
        if source == sys.stdin:
            message = sys.stdin.readline()
            sio.emit('output', str(message))
