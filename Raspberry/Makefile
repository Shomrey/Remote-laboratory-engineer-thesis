include envfile
export $(shell sed 's/=.*//' envfile)

SERVER_ADDR = https://remote-laboratory.herokuapp.com/
DEVICE_ID = malina_1

FAKE_SWITCH_PORT = $(shell docker ps --format "table {{.Image}}\t{{.Ports}}" | grep 'fake-switches' | awk '{print $$2}' | cut -c9-13)
FAKE_SWITCH_ADDR = $(shell docker ps --format "table {{.Image}}\t{{.Ports}}" | grep 'fake-switches' | awk '{print $$2}' | cut -c1-7)


SERIAL_PORT = $(shell dmesg | grep -i FTDI | grep -i tty | grep -o '\btty\w*')

stop_containers:
	-docker stop $(shell docker ps | grep 'fake-switches'| awk '{print $$1}')
rm_containers:
	-docker rm $(shell docker ps | grep 'fake-switches'| awk '{print $$1}')

run_simulator:
ifdef MODEL
	docker run -P -d -e SWITCH_MODEL=$(MODEL) internap/fake-switches
else
	docker run -P -d -e SWITCH_MODEL="cisco_2960_24TT_L" internap/fake-switches
endif

simulator: stop_containers rm_containers run_simulator
	python3 simulator_manager.py $(FAKE_SWITCH_ADDR) $(FAKE_SWITCH_PORT) $(SERVER_ADDR) $(DEVICE_ID)

device:
    python3 device_manager.py $(DEVICE) $(DEVICE_ID) $(SERVER_ADDR)

