import React, { Component } from 'react';
import Axios from 'axios';
import OneLectureDisplay from './OneLectureDisplay';
import SplitButton from './LecturesDisplayList';
import { Grid, Container, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChooseLabComponent from '../ChooseLabComponent';
import ChangeLectureForm from './ChangeLectureForm';



class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        labs: [],
        teachers: [],
        labsLoaded: false,
        currentLectureIndex: -1,
        currentLectureState: {}
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

    handleLectureChoice = (index) => {
        this.setState({ currentLectureIndex: index });
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




    render() {
        let lectureToDisplayGuard;
        let submitButton;
        console.log(this.state.teachers);
        if (this.state.currentLectureIndex != -1) {
            submitButton = <Button variant="contained" color="primary" onClick={this.sendRequest}>Submit changes</Button>
            lectureToDisplayGuard = <ChangeLectureForm lectureChange={this.handleLectureChange} lab={this.state.labs[this.state.currentLectureIndex]} teachers={this.state.teachers} />
        }
        else {
            submitButton = "";
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