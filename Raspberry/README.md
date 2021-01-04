## Raspberry
Jako sprzęt laboratoryjny na ten moment jest wykorzystywana bilbioteka fake-switches, w przyszłości będzie to rzeczywisty sprzęt laboratoryjny.<br /> 
Skrypt ssh-console.py łączy się po ssh z interfejsem switcha, i udostępnia go użytkownikowi w formie konsoli. <br /> 
### Uruchomienie:
Uruchomienie switch-a: (na Raspbianie trzeba zbudować obraz ze źródła, ten gotowy z dockerhuba nie chce współpracować):
```shell
$ git clone https://github.com/internap/fake-switches
$ cd fake-switches
$ docker build -t fake-switches .
$ docker run -P -d fake-switches
```
Pobranie bibliotek:
```shell
$ pip install cryptography
$ pip install paramiko
```
Uruchomienie skryptu:
```shell
$ cd Raspberry
$ make program
python3 ssh-console.py 0.0.0.0 32769
Successful connection!
switch> enable
switch>enable
Password: 
switch> root

switch#
switch> show run
show run
Building configuration...

Current configuration : 388 bytes
version 12.1
!
hostname switch
!
!
vlan 1
!
interface FastEthernet0/1
!
interface FastEthernet0/2
!
interface FastEthernet0/3
!
interface FastEthernet0/4
!
interface FastEthernet0/5
!
interface FastEthernet0/6
!
interface FastEthernet0/7
!
interface FastEthernet0/8
!
interface FastEthernet0/9
!
interface FastEthernet0/10
!
interface FastEthernet0/11
!
interface FastEthernet0/12
!
end

switch#
switch>