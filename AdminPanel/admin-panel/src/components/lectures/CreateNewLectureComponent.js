import React, { Component } from 'react';
import Axios from 'axios';
import MultilineTextFields from './NewLectureForm';
import { Button, Grid, Container } from '@material-ui/core';

class CreateNewLectureComponent extends Component {
    constructor(props) {
        super(props);
    }

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

    onClickCancel = () => {
        console.log('cancel');
        console.log(this.props);
        this.props.cancelFunction();
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
            >
                <MultilineTextFields teachers={this.state.teachers} passNewLectureData={this.handleDataPass} />
                <Container>
                    <Button style={{ width: '22ch', margin: '1ch' }} variant="contained" color="primary" onClick={this.sendRequest}>Create lecture</Button>
                    <Button style={{ width: '14ch' }} variant="contained" color="primary" onClick={this.onClickCancel}>Cancel</Button>
                </Container>
            </Grid>
        );
    }
}

export default CreateNewLectureComponent;
