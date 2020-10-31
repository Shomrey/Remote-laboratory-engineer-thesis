import serial
import sys
import select
import time

sleep_time = 0.5


def get_message(source):
    ready_to_read = source.inWaiting()
    time.sleep(sleep_time)
    while source.inWaiting() > ready_to_read:
        ready_to_read = source.inWaiting()
        time.sleep(sleep_time)
    result = source.read(source.inWaiting())
    source.reset_input_buffer()
    return result


def main():
    ser = serial.Serial('/dev/ttyUSB0')

    while True:
        read_list = [sys.stdin, ser]
        read_ready, write_ready, err = select.select(read_list, [], [])
        for source in read_ready:
            if source == ser:
                resp = get_message(ser)
                print(resp.decode())
            elif source == sys.stdin:
                message = sys.stdin.readline()
                ser.write(str.encode(message + '\r\n'))
                print("Send to device:")
                print(str.encode(message + '\r\n'))
                ser.reset_output_buffer()


if __name__ == "__main__":
    main()
