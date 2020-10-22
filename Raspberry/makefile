#port where docker works - it is not always 22!
FAKE_SWITCH_PORT = $(shell docker ps --format "table {{.Image}}\t{{.Ports}}" | grep 'fake-switches' | awk '{print $$2}' | cut -c9-13)
FAKE_SWITCH_ADDR = $(shell docker ps --format "table {{.Image}}\t{{.Ports}}" | grep 'fake-switches' | awk '{print $$2}' | cut -c1-7)


build:
	git clone https://github.com/internap/fake-switches
	docker build -t fake-switches ./fake-switches
	

fake-switch-run:
	docker run -P -d fake-switches

program:
	python3 tmp.py $(FAKE_SWITCH_ADDR) $(FAKE_SWITCH_PORT)

all: fake-switch-build, fake-switch-run, program
	
