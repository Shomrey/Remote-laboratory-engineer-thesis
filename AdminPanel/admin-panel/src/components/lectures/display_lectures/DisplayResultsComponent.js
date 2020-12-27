import React, { Component } from 'react';
import { Container, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@material-ui/core';
import Axios from 'axios';

class DisplayResultsComponent extends Component {
    state = {
        currentStudentId: -1,
        users: [],
        results: [],
        expectedConfiguration: "",
        grade: 0
    }
    componentDidMount() {
        console.log('display results for lab:' + this.props.labId);
        const url = "https://remote-laboratory.herokuapp.com/api/users";
        const expectedUrl = "https://remote-laboratory.herokuapp.com/api/labs";
        const resultsUrl = "https://remote-laboratory.herokuapp.com/api/labs/" + this.props.labId + "/results";
        console.log("getting users");
        Axios.get(url).then(response => this.setState({ users: response.data.filter(user => user.userType == "student") }))
        Axios.get(resultsUrl).then(response => {
            console.log('------------------------------------');
            console.log(response.data);
            this.setState({ results: response.data });
        })
        Axios.get(expectedUrl).then(response => {
            this.setState({
                expectedConfiguration: response.data
                    .filter(lab => lab.id == this.props.labId)[0]
                    .expectedConfiguration
            });
            console.log('===============================')
            console.log(response.data);
            console.log(response.data.filter(lab => lab.id == this.props.labId));

        });

        this.setState({ usersLoaded: true });
    }
    getStudentName = (id) => {
        //console.log(this.state.users);
        let filteredStudent = this.state.users.filter(user => user.id === id);
        //console.log(filteredStudent);
        let name = id != -1 ? filteredStudent[0].name + " " + filteredStudent[0].surname : "";
        return name;
    }
    getStudentResult = (id) => {
        if (id === -1) return "Please choose student";
        let filteredStudent = this.state.results.filter(user => user.studentId === id);
        console.log(filteredStudent[0].result);
        console.log("to be displayed: " + filteredStudent[0]);
        return typeof (filteredStudent[0].result) != "undefined" ? filteredStudent[0].result : "No result for this student";
    }
    handleChange = (evt) => {
        //console.log(evt.target.value);
        this.setState({ currentStudentId: evt.target.value })
        console.log(this.state);
    }
    handleGrade = (evt) => {
        //console.log(evt.target.value);
        this.setState({ grade: evt.target.value })
    }
    sendGrade = () => {
        let url = "https://remote-laboratory.herokuapp.com/api/users/" + this.state.currentStudentId + "/labs/" + this.props.labId + "/grade";
        let grade = { "score": parseInt(this.state.grade) };
        Axios.patch(url, grade).then(console.log("graded"));
    }
    render() {
        return (
            <div>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Container>
                            <FormControl style={{ margin: '1ch' }} variant="filled" >
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
                            <TextField
                                id="outlined-grade"
                                label="Grade"
                                onChange={this.handleGrade}
                                variant="outlined"
                                name="grade"
                                defaultValue={this.state.grade}
                                style={{ margin: '1ch' }}
                            />
                            <Button style={{ margin: '1ch' }} onClick={this.sendGrade} variant="contained" color="primary">Send grade</Button>
                            <Button style={{ margin: '1ch' }} onClick={this.props.cancelFunction} variant="contained" color="primary">Close</Button>
                        </Container>
                    </Grid>
                    <Grid item xs={6}>
                        <Container style={{ whiteSpace: 'pre-wrap' }}>
                            {this.getStudentResult(this.state.currentStudentId)}
                        </Container>
                    </Grid>
                    <Grid item xs={6}>
                        <Container style={{ whiteSpace: 'pre-wrap', backgroundColor: 'lightgreen' }}>
                            {this.state.expectedConfiguration}
                        </Container>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default DisplayResultsComponent;