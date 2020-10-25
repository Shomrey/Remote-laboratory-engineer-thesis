import React, { Component } from 'react';
import Axios from 'axios';
import SplitButton from './LecturesDisplayList';
import { Button } from '@material-ui/core';

class AddStudentToLectureComponent extends Component {
    state = {
        allStudents: [],
        currentLectureStudents: [],
        labs: [],
        labsLoaded: false,
        studentsLoaded: false,
        currentLectureIndex: 0
    }

    handleLectureChoice = (index) => {
        this.setState({ currentLectureIndex: index, currentLectureStudents: this.state.labs[index].students });

    }

    componentDidMount() {
        const urlLabs = "https://remote-laboratory.herokuapp.com/api/labs";
        const urlUsers = "https://remote-laboratory.herokuapp.com/api/users"
        Axios.get(urlLabs).then(response => this.setState({ labs: response.data, labsLoaded: true, currentLectureStudents: response.data[0].students }));
        Axios.get(urlUsers).then(response => this.setState({ allStudents: response.data.filter(user => user.userType == "student"), studentsLoaded: true }));
    }

    addUserToLecture = (event) => {
        const studentId = event.target.id;
        console.log(studentId);
        console.log(this.state.allStudents);
    }
    render() {
        return (
            <div>
                <SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />
                {this.state.allStudents.map((student, index) => <Button variant="contained" color="primary" id={index} onClick={this.addUserToLecture}>{student.name} {student.surname}</Button>)}
            </div>
        );
    }
}

export default AddStudentToLectureComponent;


