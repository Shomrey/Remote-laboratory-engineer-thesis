import React, { Component } from 'react';
import Axios from 'axios';
import SplitButton from '../LecturesDisplayList';
import { Button } from '@material-ui/core';
import ChangeStudentStatusInLabComponent from './ChangeStudentStatusInLabComponent';
import ChooseLabComponent from './ChooseLabComponent';

class AddStudentToLectureComponent extends Component {
    state = {
        allStudents: [],
        currentLectureStudents: [],
        labs: [],
        labsLoaded: false,
        studentsLoaded: false,
        currentLectureIndex: -1,
        oldStudentsInLab: {},
        newStudentsInLab: {},
        ready: false
    }

    handleLectureChoice = (index) => {
        console.log(index)
        this.state.allStudents.map(student => {
            this.state.oldStudentsInLab[student.id] = false
            this.state.newStudentsInLab[student.id] = false
        })
        this.setState({ currentLectureIndex: index, currentLectureStudents: this.state.labs[index].students });
        this.state.currentLectureStudents.map(student => {
            this.state.oldStudentsInLab[student.id] = true
            this.state.newStudentsInLab[student.id] = true
        })

    }

    getColor = (id) => {
        return this.state.newStudentsInLab[id] ? "primary" : "secondary";
    }

    componentDidMount() {
        const urlLabs = "https://remote-laboratory.herokuapp.com/api/labs";
        const urlUsers = "https://remote-laboratory.herokuapp.com/api/users"
        Axios.get(urlLabs).then(response => this.setState({ labs: response.data, labsLoaded: true, currentLectureStudents: response.data[0].students }));
        Axios.get(urlUsers).then(response => this.setState({ allStudents: response.data.filter(user => user.userType == "student"), studentsLoaded: true }));
        this.setState({ ready: true })
    }

    toggleStudent = (id) => {
        let tmp = this.state.newStudentsInLab[id];
        this.setState(prevState => ({ newStudentsInLab: { ...prevState.newStudentsInLab, [id]: !tmp } }))
        console.log(this.state.newStudentsInLab);
    }

    calculateAndExecuteChanges = () => {
        this.state.allStudents.map(student => {
            if (this.state.oldStudentsInLab[student.id] != this.state.newStudentsInLab[student.id]) {
                let url = "https://remote-laboratory.herokuapp.com/api/users/" + student.id + "/labs/" + this.state.currentLectureIndex + "/enroll"
                if (this.state.newStudentsInLab[student.id] == true) {
                    Axios.post(url).then(this.setState(prevState => ({ oldStudentsInLab: { ...prevState.oldStudentsInLab, [student.id]: true } })))
                }
                else {
                    Axios.delete(url).then(this.setState(prevState => ({ oldStudentsInLab: { ...prevState.oldStudentsInLab, [student.id]: false } })))
                }
            }
        })
    }

    addUserToLecture = (event) => {
        const studentId = event.target.id;
        console.log(studentId);
        console.log(this.state.allStudents);
    }
    render() {
        let display;
        let showSubmitButton;
        if (this.state.currentLectureIndex == -1) {
            display = <ChooseLabComponent labs={this.state.labs} handleChoice={this.handleLectureChoice} />
            showSubmitButton = <div></div>
        }
        else if (this.state.ready) {
            display = <ul>
                {this.state.allStudents.map((student, index) => <li><ChangeStudentStatusInLabComponent student={student} index={index} color={this.getColor(student.id)} toggle={this.toggleStudent} /> </li>)}
            </ul>

            showSubmitButton = <Button variant="outlined" onClick={this.calculateAndExecuteChanges}>Submit</Button>
        }

        else { display = <div></div>; showSubmitButton = <div></div> }
        //<SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />
        return (
            <div>

                {display}
                {showSubmitButton}
            </div>
        );
    }
}

export default AddStudentToLectureComponent;


