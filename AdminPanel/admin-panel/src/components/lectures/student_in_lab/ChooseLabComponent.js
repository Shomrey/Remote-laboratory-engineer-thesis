import React, { Component } from 'react';
import { Button } from '@material-ui/core';

class ChooseLabComponent extends Component {
    state = {}

    handleClick = (index) => {
        console.log(index);
        console.log("from chooselab: " + index);
        this.props.handleChoice(index);
    }
    render() {
        return (
            <div>
                <ul>
                    {this.props.labs.map((lecture, index) => <li> <Button variant="contained" color="primary" id={index} onClick={() => this.handleClick(index)}>{index} {lecture.title}</Button></li>)}
                </ul>
            </div>
        );
    }
}

export default ChooseLabComponent;