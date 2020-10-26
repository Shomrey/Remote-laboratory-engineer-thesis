import React, { Component } from 'react';

class OneLectureDisplay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let display = "";
        return (
            <div>
                <p>Date: {this.props.labsData.date}</p>
                <p>Duration: {this.props.labsData.duration}</p>
                <p>Title: {this.props.labsData.title}</p>
                <p>Configuration: {this.props.labsData.configuration}</p>
                <p>Description: {this.props.labsData.description}</p>
                <p>Tasks: {this.props.labsData.tasks}</p>
                <p>Topology: {this.props.labsData.topology}</p>
                <p>Max students: {this.props.labsData.maxStudents}</p>
            </div>
        );
    }
}



export default OneLectureDisplay;