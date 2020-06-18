import sqlite3
import csv
import sys

# Not sure if safe... but doesn't work otherwise
conn = sqlite3.connect('database.db', check_same_thread=False)
conn.row_factory = sqlite3.Row
c = conn.cursor()


def create_tables():
    global c
    # Students table
    c.execute('''CREATE TABLE IF NOT EXISTS Students (id integer PRIMARY KEY AUTOINCREMENT, name text , surname text , mail text UNIQUE,  password_hash text NOT NULL)''')
    conn.commit()

    # Teachers table
    c.execute('''CREATE TABLE IF NOT EXISTS Teachers (id integer PRIMARY KEY AUTOINCREMENT, name text, surname text, mail text UNIQUE, password_hash text NOT NULL)''')
    conn.commit()

    # Labs table
    c.execute('''CREATE TABLE IF NOT EXISTS Labs (id integer PRIMARY KEY AUTOINCREMENT,date text,duration integer, title text, configuration text, description text, topology blob, max_students integer DEFAULT 1,teacher integer, FOREIGN KEY(teacher) REFERENCES Teachers(id))''')
    conn.commit()

    # Enrollments table
    c.execute('''CREATE TABLE IF NOT EXISTS Enrollments (id integer PRIMARY KEY AUTOINCREMENT, student integer, laboratory integer, result text, score int, comment text,FOREIGN KEY(student) REFERENCES Students(id),FOREIGN KEY(laboratory) REFERENCES Labs(id) )''')
    conn.commit()


def add_student(name: str, surname: str, mail: str, password_hash: str) -> bool:
    global c
    sql = ''' INSERT INTO Students(name, surname, mail, password_hash) VALUES (?,?,?,?)'''

    try:
        c.execute(sql, (name, surname, mail, password_hash))
        conn.commit()
        print("Student", name, surname, mail, "added")
        return True
    except sqlite3.Error as e:
        print("Failed to add student, database error:", e)
        return False


def add_teacher(name: str, surname: str, mail: str, password_hash: str) -> bool:
    global c
    sql = ''' INSERT INTO Teachers(name, surname, mail, password_hash) VALUES (?,?,?,?)'''

    try:
        c.execute(sql, (name, surname, mail, password_hash))
        conn.commit()
        print("Teacher", name, surname, mail, "added")
        return True
    except:
        print("Failed to add teacher")
        return False


def add_laboratory(date: str, duration: int, title: str, configuration: str, description: str, topology, max_students: int, teacher: int) -> bool:
    global c
    check = c.execute('SELECT * FROM Teachers WHERE id=?', (teacher,))
    if len(check.fetchall()) == 0:
        print("Failed to add library, no teacher with id: "+str(teacher))
        return False

    sql = ''' INSERT INTO Labs(date,duration, title, configuration, description, topology, max_students, teacher) VALUES(?,?,?,?,?,?,?,?)'''
    try:
        c.execute(sql, (date, duration, title, configuration,
                        description, topology, max_students, teacher))
        conn.commit()
        return True
    except:
        print("Failed to add laboratory")
        return False


def enroll_student(student_id: int, lab_id: int) -> bool:
    global c
    check_student = c.execute(
        'SELECT * FROM Students WHERE id=?', (student_id,))
    if len(check_student.fetchall()) == 0:
        print("Failed to enroll, no student with id: "+str(student_id))
        return False
    check_lab = c.execute('SELECT * FROM Labs WHERE id=?', (lab_id,))
    if len(check_lab.fetchall()) == 0:
        print("Failed to enroll, no laboratory with id: "+str(lab_id))
        return False

    sql = ''' INSERT INTO Enrollments (student, laboratory) VALUES(?,?)'''
    try:
        c.execute(sql, (student_id, lab_id))
        conn.commit()
        return True
    except:
        print("Failed to add enrollment")
        return False

# VIEWS


def get_teacher_labs(teacher_id: int) -> list:
    global c
    check_teacher = c.execute(
        'SELECT * FROM Teachers WHERE id=?', (teacher_id,))
    if len(check_teacher.fetchall()) == 0:
        print("Failed to read, no teacher with id: "+str(teacher_id))
        return None
    result = c.execute('SELECT * FROM Labs WHERE teacher=?', (teacher_id,))
    return result.fetchall()


def get_students_from_lab(lab_id: int) -> list:
    global c
    check_lab = c.execute('SELECT * FROM Labs WHERE id=?', (lab_id,))
    if len(check_lab.fetchall()) == 0:
        print("Failed to read, no laboratory with id: "+str(lab_id))
        return None
    result = c.execute(
        'SELECT student FROM Enrollments WHERE laboratory=?', (lab_id,))
    return result.fetchall()


def get_labs_for_student(student_id: int) -> list:
    global c
    check_student = c.execute(
        'SELECT * FROM Students WHERE id=?', (student_id,))
    if len(check_student.fetchall()) == 0:
        print("Failed to read, no student with id: "+str(student_id))
        return False
    result = c.execute(
        'SELECT laboratory FROM Enrollments WHERE student=?', (student_id,))
    return result.fetchall()


def validate_student(mail: str, password: str):
    global c
    students = c.execute(
        'SELECT * FROM Students WHERE mail=?', (mail,))
    student = students.fetchone()
    if student == None:
        print("Failed to validate student, no student with mail: " + str(mail))
        return False
    else:
        print(student)
        if student['password_hash'] == password:
            return True
        else:
            print('Passwords do not match')
            return False
