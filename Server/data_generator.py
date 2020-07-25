
import database
import random
import csv


def add_students():
    with open('sample_data/Students.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_user(data[1], data[2], data[3], data[4], 'student')


def add_teachers():
    with open('sample_data/Teachers.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_user(data[1], data[2], data[3], data[4], 'teacher')


def add_labs():
    with open('sample_data/Labs.csv', newline='') as f:
        reader = csv.reader(f)
        datas = list(reader)
    for data in datas:
        database.add_laboratory(data[1],
            data[2], data[3], data[4], data[5], data[6], data[7], int(data[8]), int(data[9]))


def add_enrollments():
    # jak jest inna liczba studentw ni 100 i inna liczba labow niz 10 to tutaj trzeba zmienic
    for i in range(1, 100):
        database.enroll_student(i, random.randint(1, 9))


database.create_tables()

add_students()
add_teachers()
add_labs()
add_enrollments()
