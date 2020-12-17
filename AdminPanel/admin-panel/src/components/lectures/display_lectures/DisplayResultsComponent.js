import React, { Component } from 'react';
import { Container, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Axios from 'axios';

class DisplayResultsComponent extends Component {
    state = {
        currentStudentId: -1,
        users: [],
        results: []
    }
    componentDidMount() {
        console.log('display results for lab:' + this.props.labId);
        const url = "https://remote-laboratory.herokuapp.com/api/users";
        const resultsUrl = "https://remote-laboratory.herokuapp.com/api/labs/" + this.props.labId + "/results";
        console.log("getting users");
        Axios.get(url).then(response => this.setState({ users: response.data.filter(user => user.userType == "student") }))
        Axios.get(resultsUrl).then(response => this.setState({ results: response.data }))
        this.setState({ usersLoaded: true });
    }
    getStudentName = (id) => {
        console.log(id);
        console.log(this.state.users);
        let filteredStudent = this.state.users.filter(user => user.id === id);
        console.log(filteredStudent);
        let name = id != -1 ? filteredStudent[0].name + " " + filteredStudent[0].surname : "";
        return name;
    }
    getStudentResult = (id) => {
        if (id === -1) return "Please choose student";
        let filteredStudent = this.state.results.filter(user => user.studentId === id);
        return filteredStudent.result ? filteredStudent.result : "No result for this student";
    }
    handleChange = (evt) => {
        console.log(evt.target.value);
        this.setState({ currentStudentId: evt.target.value })
    }
    render() {
        return (
            <div>
                <Container>
                    <FormControl variant="filled" >
                        <InputLabel id="select-label">Student</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            value={this.state.currentStudentId}
                            //defaultValue={props.teachers.filter(teacher => teacher.id === state.teacherId)[0]}
                            onChange={this.handleChange}
                            name="teacherId"
                            variant="outlined"
                        >
                            {this.state.results.map(result => <MenuItem value={result.studentId}>{this.getStudentName(result.studentId)}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Container>
                <Container>{this.getStudentResult(this.state.currentStudentId)}</Container>

            </div>
        );
    }
}

export default DisplayResultsComponent;