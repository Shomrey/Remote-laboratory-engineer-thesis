import React, { Component } from 'react';

class OneLectureDisplay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <p>Name: {this.props.userData.name}</p>
                <p>Surname: {this.props.userData.surname}</p>
                <p>Mail: {this.props.userData.mail}</p>
            </div>
        );
    }
}



export default OneLectureDisplay;