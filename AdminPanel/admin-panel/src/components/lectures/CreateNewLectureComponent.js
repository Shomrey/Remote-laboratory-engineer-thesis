import React, { Component } from 'react';
import Axios from 'axios';
import MultilineTextFields from './NewLectureForm';
import { Button, Grid } from '@material-ui/core';

class CreateNewLectureComponent extends Component {
    state = {
        newLectureData: {},
        currentUser: {},
        userLoaded: false,
        teachers: []
    }

    handleDataPass = (state) => {
        this.setState({ newLectureData: state });
    }

    sendRequest = () => {
        const teacherId = this.state.currentUser.id;
        const url = "https://remote-laboratory.herokuapp.com/api/labs";
        let lecture = this.state.newLectureData;
        lecture.teacherId = teacherId;
        lecture.duration = parseInt(lecture.duration);
        lecture.maxStudents = parseInt(lecture.maxStudents);
        Axios.post(url, lecture).then(response => console.log(response));
    }

    componentDidMount() {
        const url = "https://remote-laboratory.herokuapp.com/api/users/current";
        console.log("getting current user");
        Axios.get(url).then(response => this.setState({ currentUser: response.data }));
        this.setState({ userLoaded: true });
        const urlTeachers = "https://remote-laboratory.herokuapp.com/api/users";
        console.log("getting teachers");
        Axios.get(urlTeachers).then(response => { console.log(response); this.setState({ teachers: response.data.filter(user => user.userType == "teacher") }) });
    }

    render() {
        return (
            <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                <MultilineTextFields teachers={this.state.teachers} passNewLectureData={this.handleDataPass} />
                <Button disabled={!this.state.userLoaded} variant="contained" color="primary" onClick={this.sendRequest}>Create lecture</Button>
            </Grid>
        );
    }
}

export default CreateNewLectureComponent;
