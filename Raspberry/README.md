# Raspberry
This directory contains scripts responsible for connecting with network devices, simulators or host console.
## Requirements
System requirements
* Linux-based system
* Docker v.19 + 
* GNU Make
* python v.3 +
  
Install python dependencies:

```$ pip3 install -r requirements.txt```

# Device Mode
In this mode we connect server with network device(wchich is connetcted to Raspberry via serial port).
First find out which port is assosiated with our device:


```$ sudo gmesg | grep -i tty```

Choose proper port, for  example: ```ttyUSB0```.

To run program just execute following command:

```sudo make device DEVICE=ttyUSB0 DEVICE_ID=cisco_switch_01```

Where ```DEVICE_ID``` is unique id, by wchich students will be able to select this device.

# Simulator Mode
In this mode we connect server with network device simulator.

To run program just execute following command:

```sudo make simulator DEVICE_ID=simulated_switch_01```

Where ```DEVICE_ID``` is unique id, by wchich students will be able to select this device.

The device which is simulated by default is `cisco_2960_24TT_L`.
We can select which device to run by passing variable `MODEL` with available device type:
* brocade_generic
* cisco_generic
* cisco_2960_24TT_L
* cisco_2960_48TT_L
* dell_generic
* dell10g_generic
* juniper_generic
* juniper_qfx_copper_generic


# Host Mode
In this mode we connect server with device shell.
It is useful, when we want to execute commands as host, which is connected to the network.

To run To run program just execute following command:

```sudo make host DEVICE_ID=host_01```

Where ```DEVICE_ID``` is unique id, by wchich students will be able to select this device.