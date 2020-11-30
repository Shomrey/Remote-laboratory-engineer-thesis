import React, { Component } from 'react';
import Axios from 'axios';
import SplitButton from '../display_lectures/LecturesDisplayList';
import { Button, Checkbox, Container, Switch, FormGroup, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import ChangeStudentStatusInLabComponent from './ChangeStudentStatusInLabComponent';
import ChooseLabComponent from '../ChooseLabComponent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';

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
        ready: false,
        onlyEnrolled: false,
        nameSearchBar: "",
        surnameSearchBar: "",
        mailSearchBar: ""
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
        console.log(this.state);

    }

    handleChangeSwitch = (event) => {
        this.setState({ [event.target.name]: event.target.checked })
    }

    getColor = (id) => {
        return this.state.newStudentsInLab[id] ? "primary" : "secondary";
    }

    isEnrolled = (id) => {
        return this.state.newStudentsInLab[id] ? true : false;
    }

    componentDidMount() {
        const urlLabs = "https://remote-laboratory.herokuapp.com/api/labs";
        const urlUsers = "https://remote-laboratory.herokuapp.com/api/users"
        Axios.get(urlLabs).then(response => { console.log(response); this.setState({ labs: response.data, labsLoaded: true, currentLectureStudents: response.data[0].students }) });
        Axios.get(urlUsers).then(response => { console.log(response); this.setState({ allStudents: response.data.filter(user => user.userType == "student"), studentsLoaded: true }) });
        this.setState({ ready: true })
        console.log(this.state);
    }

    toggleStudent = (id) => {
        let tmp = this.state.newStudentsInLab[id];
        this.setState(prevState => ({ newStudentsInLab: { ...prevState.newStudentsInLab, [id]: !tmp } }))
        console.log(this.state.newStudentsInLab);
    }

    calculateAndExecuteChanges = () => {
        this.state.allStudents.map(student => {
            if (this.state.oldStudentsInLab[student.id] != this.state.newStudentsInLab[student.id]) {
                console.log("student status change:" + student.id);
                let url = "https://remote-laboratory.herokuapp.com/api/users/" + student.id + "/labs/" + this.state.labs[this.state.currentLectureIndex].id + "/enroll"
                console.log(url);
                if (this.state.newStudentsInLab[student.id] == true) {
                    Axios.post(url).then(response => { console.log(response); this.setState(prevState => ({ oldStudentsInLab: { ...prevState.oldStudentsInLab, [student.id]: true } })) })
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

    handleSearchBarChange = (evt) => {
        let name = [evt.target.name];
        let field = name + "SearchBar";
        console.log(field);
        console.log(this.state[field])
        this.setState({ [field]: evt.target.value })
    }
    render() {
        let display;
        let showSubmitButton;
        let enrollSwitch;
        if (this.state.currentLectureIndex == -1) {
            display = <ChooseLabComponent labs={this.state.labs} handleChoice={this.handleLectureChoice} />
            showSubmitButton = <div></div>
        }
        else if (this.state.ready) {
            //<List>
            //    {this.state.allStudents.filter(studentFilter => this.state.onlyEnrolled ? this.isEnrolled(studentFilter.id) : true).map((student, index) => <ListItem><ChangeStudentStatusInLabComponent student={student} index={index} color={this.getColor(student.id)} toggle={this.toggleStudent} /> </ListItem>)}
            //</List>
            display = <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><TextField name="name" onChange={this.handleSearchBarChange} label="First name" /></TableCell>
                            <TableCell><TextField name="surname" onChange={this.handleSearchBarChange} label="Surname" /></TableCell>
                            <TableCell><TextField name="mail" onChange={this.handleSearchBarChange} label="Mail" /></TableCell>
                            <TableCell><strong>Enrolled</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.allStudents
                            .filter(studentFilter => this.state.onlyEnrolled ? this.isEnrolled(studentFilter.id) : true)
                            .filter(user => user.name.includes(this.state.nameSearchBar))
                            .filter(user => user.surname.includes(this.state.surnameSearchBar))
                            .filter(user => user.mail.includes(this.state.mailSearchBar))
                            .map(
                                (student, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left">{student.name}</TableCell>
                                        <TableCell align="left">{student.surname}</TableCell>
                                        <TableCell align="left">{student.mail}</TableCell>
                                        <TableCell align="left"><Checkbox onChange={() => this.toggleStudent(student.id)} checked={this.isEnrolled(student.id)} id={student.id} /></TableCell>
                                    </TableRow>

                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            //<ChangeStudentStatusInLabComponent student={student} index={index} enrolled={this.isEnrolled(student.id)} toggle={this.toggleStudent} />
            showSubmitButton = <Button variant="outlined" color="primary" onClick={this.calculateAndExecuteChanges}>Submit</Button>
            enrollSwitch = <FormGroup row><FormControlLabel
                control={<Switch checked={this.state.onlyEnrolled} onChange={this.handleChangeSwitch} name="onlyEnrolled" color="primary" />}
                label="Only enrolled"
            /></FormGroup>
        }

        else { display = <div></div>; showSubmitButton = <div></div> }
        //<SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />

        return (
            <Container>
                {enrollSwitch}
                {display}
                {showSubmitButton}
            </Container>
        );
    }
}

export default AddStudentToLectureComponent;


