import React, { Component } from 'react';
import Axios from 'axios';
import OneLectureDisplay from './OneLectureDisplay';
import SplitButton from './LecturesDisplayList';
import { Grid, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChooseLabComponent from '../ChooseLabComponent';
import ChangeLectureForm from './ChangeLectureForm';
import CreateNewLectureComponent from '../CreateNewLectureComponent';
import AddStudentToLectureComponent from '../student_in_lab/AddStudentToLectureComponent';
import DisplayResultsComponent from './DisplayResultsComponent';



class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        labs: [],
        teachers: [],
        labsLoaded: false,
        currentLectureIndex: -1,
        currentLectureState: {},
        createLab: false,
        lectureEditionType: ''
    }
    componentDidMount() {
        const url = "https://remote-laboratory.herokuapp.com/api/labs";
        console.log("getting labs");
        Axios.get(url).then(response => this.setState({ labs: response.data }));
        const urlTeachers = "https://remote-laboratory.herokuapp.com/api/users";
        console.log("getting teachers");
        Axios.get(urlTeachers).then(response => { console.log(response); this.setState({ teachers: response.data.filter(user => user.userType == "teacher") }) });
        this.setState({ labsLoaded: true });
    }

    handleClick = (e) => {
        e.preventDefault();
        this.state.labs.map(lab => console.log(lab))
    }

    handleLectureChoice = (index, type) => {
        this.setState({ currentLectureIndex: index, lectureEditionType: type });
    }

    handleLectureChange = (lectureState) => {
        this.setState({ currentLectureState: lectureState })
    }

    sendRequest = () => {
        const url = "https://remote-laboratory.herokuapp.com/api/labs/" + this.state.currentLectureState.id;
        console.log(url);
        const { id, ...lecture } = this.state.currentLectureState;
        console.log(lecture);
        Axios.patch(url, lecture).then(console.log("lab updated")).catch((error) => console.log(error));
        console.log(this.state.currentLectureState);
    }

    toggleCreate = () => {
        let tmp = this.state.createLab;
        this.setState({ createLab: !tmp });
        console.log('toggle create');
    }




    render() {
        let lectureToDisplayGuard;
        let submitButton;
        //console.log(this.state.teachers);
        if (this.state.currentLectureIndex != -1) {
            if (this.state.lectureEditionType == 'enroll') {
                submitButton = ""
                lectureToDisplayGuard = <AddStudentToLectureComponent cancelFunction={() => this.handleLectureChoice(-1, "")} lectureId={this.state.currentLectureIndex} />

            }
            else if (this.state.lectureEditionType == 'results') {
                submitButton = "";
                lectureToDisplayGuard = <DisplayResultsComponent labId={this.state.labs[this.state.currentLectureIndex].id} />
            }
            else {
                submitButton = <Button variant="contained" color="primary" onClick={this.sendRequest}>Submit changes</Button>
                lectureToDisplayGuard = <ChangeLectureForm lectureChange={this.handleLectureChange} lab={this.state.labs[this.state.currentLectureIndex]} teachers={this.state.teachers} />

            }
        }
        else if (this.state.createLab) {
            lectureToDisplayGuard = <CreateNewLectureComponent cancelFunction={this.toggleCreate} />
            submitButton = ""
        }
        else {
            submitButton = <Button style={{ margin: '1ch' }} variant="contained" color="primary" onClick={this.toggleCreate}>Create new laboratory</Button>
            lectureToDisplayGuard = <ChooseLabComponent labs={this.state.labs} handleChoice={this.handleLectureChoice} />;
        }
        const style = {
            paddingLeft: '30px'
        }
        return (
            <Container>
                {lectureToDisplayGuard}
                {submitButton}
            </Container>

        );
    }
}

/*<Container>
                            <SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />
                        </Container> */

export default DisplayExistingLecturesComponent;