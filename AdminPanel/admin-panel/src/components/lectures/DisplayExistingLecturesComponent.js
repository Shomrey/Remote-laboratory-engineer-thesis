import React, { Component } from 'react';
import Axios from 'axios';
import OneLectureDisplay from './OneLectureDisplay';
import SplitButton from './LecturesDisplayList';



class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        labs: [],
        labsLoaded: false,
        currentLectureIndex: 0
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



    render() {
        let lectureToDisplayGuard;
        if (typeof (this.state.labs[this.state.currentLectureIndex]) != "undefined") lectureToDisplayGuard = <OneLectureDisplay labsData={this.state.labs[this.state.currentLectureIndex]} />
        else lectureToDisplayGuard = "";
        return (
            <div>
                <SplitButton titleList={this.state.labs.map(lab => lab.title)} handleTitleChoice={this.handleLectureChoice} />
                {lectureToDisplayGuard}
            </div >
        );
    }
}

export default DisplayExistingLecturesComponent;