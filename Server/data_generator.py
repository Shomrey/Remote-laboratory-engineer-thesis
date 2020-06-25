
import database
import random

import csv

def add_students():
    with open('Students.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_student(int(data[0]),data[1],data[2],data[3],data[4])

def add_teachers():
    with open('Teachers.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_teacher(int(data[0]),data[1],data[2],data[3],data[4])


def add_labs():
    with open('Labs.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_laboratory(int(data[0]),data[1],int(data[2]),data[3],data[4],data[5],data[6],int(data[7]),int(data[8]))

def add_enrollments():
    #jak jest inna liczba studentw ni 100 i inna liczba labow niz 10 to tutaj trzeba zmienic
    for i in range(1, 100):
        database.enroll_student(i,random.randint(1,9))


print(str(database.get_teacher_labs(8)))