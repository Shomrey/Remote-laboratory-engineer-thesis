import React, { Component } from 'react';
import Axios from 'axios';
import { Button } from '@material-ui/core';

class ChangeStudentStatusInLabComponent extends Component {
    state = {
        color: this.props.color
    }

    handleClick = (id) => {
        console.log("change student id: " + id);
        let currColor = this.state.color;
        let newColor = currColor == "primary" ? "secondary" : "primary"
        this.setState({ color: newColor })
        this.props.toggle(id);
    }
    render() {
        return (<Button variant="contained" color={this.props.color} id={this.props.student.id} onClick={() => this.handleClick(this.props.student.id)}>{this.props.student.name} {this.props.student.surname}</Button>);
    }
}

export default ChangeStudentStatusInLabComponent;