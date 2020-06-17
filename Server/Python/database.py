import sqlite3
import csv

conn = sqlite3.connect('database.db')
c = conn.cursor()

def create_tables():
    global c
    #Tabela studentow
    c.execute('''CREATE TABLE Students (id integer PRIMARY KEY, name text , surname text , mail text UNIQUE,  password_hash text NOT NULL)''')
    conn.commit()
    #Tabela nauczycieli
    c.execute('''CREATE TABLE Teachers (id integer PRIMARY KEY, name text, surname text, mail text UNIQUE, password_hash text NOT NULL)''')
    conn.commit()
    #Tabela labow
    c.execute('''CREATE TABLE Labs (id integer PRIMARY KEY,date text,duration integer, title text, configuration text, description text, topology blob, max_students integer DEFAULT 1,teacher integer, FOREIGN KEY(teacher) REFERENCES Teachers(id))''')
    conn.commit()
    #Tabela zapisow studentow na pojedyncze laby
    c.execute('''CREATE TABLE Enrollments (id integer PRIMARY KEY AUTOINCREMENT, student integer, laboratory integer, result text, score int, comment text,FOREIGN KEY(student) REFERENCES Students(id),FOREIGN KEY(laboratory) REFERENCES Labs(id) )''')
    conn.commit()
   

def add_student(id:int, name:str, surname:str, mail: str, password_hash: str)-> bool:
    global c
    sql = ''' INSERT INTO Students(id, name, surname, mail, password_hash) VALUES (?,?,?,?,?)'''
    
    try:
        c.execute(sql, (id,name, surname, mail, password_hash))     
        conn.commit()
        return True
    except:
        print("Failed to add student")
        return False

def add_teacher(id:int, name:str, surname:str, mail: str, password_hash: str)-> bool:
    global c
    sql = ''' INSERT INTO Teachers(id, name, surname, mail, password_hash) VALUES (?,?,?,?,?)'''
    
    try:
        c.execute(sql, (id,name, surname, mail, password_hash))     
        conn.commit()
        return True
    except:
        print("Failed to add teacher")
        return False

def add_laboratory(id:int, date:str, duration:int, title:str, configuration:str, description:str, topology, max_students:int, teacher:int )->bool:
    global c
    check = c.execute('SELECT * FROM Teachers WHERE id=?', (teacher,))
    if len(check.fetchall())==0:
        print("Failed to add library, no teacher with id: "+str(teacher))
        return False

    sql = ''' INSERT INTO Labs(id, date,duration, title, configuration, description, topology, max_students, teacher) VALUES(?,?,?,?,?,?,?,?,?)'''
    try:
        c.execute(sql, (id,date, duration, title, configuration, description,topology,max_students, teacher))     
        conn.commit()
        return True
    except:
        print("Failed to add laboratory")
        return False

def enroll_student(student_id: int, lab_id:int)->bool:
    global c
    check_student = c.execute('SELECT * FROM Students WHERE id=?', (student_id,))
    if len(check_student.fetchall())==0:
        print("Failed to enroll, no student with id: "+str(student_id))
        return False
    check_lab = c.execute('SELECT * FROM Labs WHERE id=?', (lab_id,))
    if len(check_lab.fetchall())==0:
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
def get_teacher_labs(teacher_id:int)->list:
    global c
    check_teacher = c.execute('SELECT * FROM Teachers WHERE id=?', (teacher_id,))
    if len(check_teacher.fetchall())==0:
        print("Failed to read, no teacher with id: "+str(teacher_id))
        return None
    result=c.execute('SELECT * FROM Labs WHERE teacher=?', (teacher_id,))
    return result.fetchall()


def get_students_from_lab(lab_id:int)->list:
    global c
    check_lab = c.execute('SELECT * FROM Labs WHERE id=?', (lab_id,))
    if len(check_lab.fetchall())==0:
        print("Failed to read, no laboratory with id: "+str(lab_id))
        return None
    result=c.execute('SELECT student FROM Enrollments WHERE laboratory=?', (lab_id,))
    return result.fetchall()  



def get_labs_for_student(student_id:int)->list:
    global c
    check_student = c.execute('SELECT * FROM Students WHERE id=?', (student_id,))
    if len(check_student.fetchall())==0:
        print("Failed to read, no student with id: "+str(student_id))
        return False
    result=c.execute('SELECT laboratory FROM Enrollments WHERE student=?', (student_id,))
    return result.fetchall()  


print(str(get_labs_for_student(12342)))