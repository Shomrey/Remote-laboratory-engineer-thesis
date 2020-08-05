import sqlite3
import csv
import sys

# Not sure if safe... but doesn't work otherwise
conn = sqlite3.connect('../Server_2.0/database', check_same_thread=False)
conn.row_factory = sqlite3.Row
c = conn.cursor()


def create_tables():
    global c
    # Users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            surname TEXT, 
            mail TEXT UNIQUE, 
            password_hash TEXT NOT NULL, 
            user_type TEXT NOT NULL
        )''')
    conn.commit()

    # Labs table
    c.execute('''
        CREATE TABLE IF NOT EXISTS lab (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,duration INTEGER, 
            title TEXT, 
            configuration TEXT, 
            description TEXT,
            tasks TEXT,
            topology TEXT,
            max_students INTEGER DEFAULT 1,
            teacherId INTEGER,
            FOREIGN KEY(teacherId) REFERENCES user(id)
        )''')
    conn.commit()

    # Enrollments table
    c.execute('''
        CREATE TABLE IF NOT EXISTS enrollment (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            studentId INTEGER,
            laboratoryId INTEGER,
            result TEXT, 
            score INTEGER,
            comment TEXT,
            FOREIGN KEY(studentId) REFERENCES user(id),
            FOREIGN KEY(laboratoryId) REFERENCES lab(id)
        )''')
    conn.commit()


def add_user(name: str, surname: str, mail: str, password_hash: str, user_type: str) -> bool:
    global c
    sql = ''' INSERT INTO user(name, surname, mail, password_hash, user_type) VALUES (?,?,?,?,?)'''

    try:
        c.execute(sql, (name, surname, mail, password_hash, user_type))
        conn.commit()
        print("User", name, surname, mail, user_type, "added")
        return True
    except sqlite3.Error as e:
        print("Failed to add user, database error:", e)
        return False


def add_laboratory(date: str, duration: int, title: str, configuration: str, description: str, tasks: str, topology, max_students: int, teacherId: int) -> bool:
    global c
    check = c.execute('SELECT * FROM user WHERE id=?', (teacherId,))
    if len(check.fetchall()) == 0:
        print("Failed to add library, no teacherId with id: "+str(teacherId))
        return False

    sql = ''' INSERT INTO lab(date,duration, title, configuration, description, tasks, topology, max_students, teacherId) VALUES(?,?,?,?,?,?,?,?,?)'''
    try:
        c.execute(sql, (date, duration, title, configuration,
                        description, tasks, topology, max_students, teacherId))
        conn.commit()
        return True
    except:
        print("Failed to add laboratory")
        return False


def enroll_student(student_id: int, lab_id: int) -> bool:
    global c
    check_student = c.execute(
        'SELECT * FROM user WHERE id=?', (student_id,))
    if len(check_student.fetchall()) == 0:
        print("Failed to enroll, no student with id: "+str(student_id))
        return False
    check_lab = c.execute('SELECT * FROM lab WHERE id=?', (lab_id,))
    if len(check_lab.fetchall()) == 0:
        print("Failed to enroll, no laboratory with id: "+str(lab_id))
        return False

    sql = ''' INSERT INTO enrollment (studentId, laboratoryId) VALUES(?,?)'''
    try:
        c.execute(sql, (student_id, lab_id))
        conn.commit()
        return True
    except:
        print("Failed to add enrollment")
        return False

# VIEWS


def get_teacherId_labs(teacherId_id: int) -> list:
    global c
    check_teacherId = c.execute(
        'SELECT * FROM user WHERE id=?', (teacherId_id,))
    if len(check_teacherId.fetchall()) == 0:
        print("Failed to read, no teacherId with id: "+str(teacherId_id))
        return None
    result = c.execute('SELECT * FROM lab WHERE teacherId=?', (teacherId_id,))
    return result.fetchall()

def get_user(user_id: int):
    global c
    user = c.execute(
        'SELECT * FROM user WHERE id=?', (user_id,))
    result = user.fetchall()
    if len(result) == 0:
        print("Failed to read, no user with id: "+str(user_id))
        return None
    return result[0]


def get_students_from_lab(lab_id: int) -> list:
    global c
    check_lab = c.execute('SELECT * FROM lab WHERE id=?', (lab_id,))
    if len(check_lab.fetchall()) == 0:
        print("Failed to read, no laboratory with id: "+str(lab_id))
        return None
    result = c.execute(
        'SELECT student FROM enrollment WHERE laboratory=?', (lab_id,))
    return result.fetchall()


def get_labs_for_student(student_id: int) -> list:
    global c
    check_student = c.execute(
        'SELECT * FROM user WHERE id=?', (student_id,))
    if len(check_student.fetchall()) == 0:
        print("Failed to read, no student with id: "+str(student_id))
        return False
    result = c.execute('''
        SELECT l.*, u.name, u.surname
        FROM enrollment e
        JOIN lab l ON e.laboratory=l.id
        JOIN user u ON l.teacherId=u.id
        WHERE student=?''', (student_id,))
    return result.fetchall()


def validate_user(mail: str, password: str):
    global c
    students = c.execute(
        'SELECT * FROM user WHERE mail=?', (mail,))
    student = students.fetchone()
    if student == None:
        print("Failed to validate student, no student with mail: " + str(mail))
        return None
    else:
        if student['password_hash'] == password:
            return student['id']
        else:
            print('Passwords do not match')
            return None
