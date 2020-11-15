import React, { Component } from 'react';
import Axios from 'axios';
import OneLectureDisplay from './OneLectureDisplay';
import SplitButton from './LecturesDisplayList';
import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChooseLabComponent from '../ChooseLabComponent';
import ChangeLectureForm from './ChangeLectureForm';



class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        labs: [],
        labsLoaded: false,
        currentLectureIndex: -1,
        currentLectureState: {}
    }
    componentDidMount() {
        const url = "https://remote-laboratory.herokuapp.com/api/labs";
        console.log("getting labs");
        Axios.get(url).then(response => this.setState({ labs: response.data }));
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




    render() {
        let lectureToDisplayGuard;
        if (this.state.currentLectureIndex != -1) lectureToDisplayGuard = <ChangeLectureForm lectureChange={this.handleLectureChange} lab={this.state.labs[this.state.currentLectureIndex]} />
        else lectureToDisplayGuard = <ChooseLabComponent labs={this.state.labs} handleChoice={this.handleLectureChoice} />;
        const style = {
            paddingLeft: '30px'
        }
        return (
            <Container>
                {lectureToDisplayGuard}
            </Container>

        );
    }
}

/*<Container>
                            <SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />
                        </Container> */

export default DisplayExistingLecturesComponent;