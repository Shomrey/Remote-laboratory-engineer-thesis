#port where docker works - it is not always 22!
FAKE_SWITCH_PORT = $(shell docker ps | grep 'fake-switches'| awk '{print $$12}'|cut -c9-13)
FAKE_SWITCH_ADDR = $(shell docker ps | grep 'fake-switches'| awk '{print $$12}'|cut -c1-7)


fake-switch-build:
	git clone https://github.com/internap/fake-switches
	cd fake-switches
	docker build -t fake-switches .
	cd ..

fake-switch-run:
	docker run -P -d fake-switches

program:
	python3 virtual-device.py $(FAKE_SWITCH_ADDR) $(FAKE_SWITCH_PORT)