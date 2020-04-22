#port where docker works - it is not always 22!
FAKE_SWITCH_PORT = $(shell docker ps | grep 'fake-switches'| awk '{print $$12}'|cut -c9-13)
FAKE_SWITCH_ADDR = $(shell docker ps | grep 'fake-switches'| awk '{print $$12}'|cut -c1-7)


program:
	python3 ssh-console.py $(FAKE_SWITCH_ADDR) $(FAKE_SWITCH_PORT)