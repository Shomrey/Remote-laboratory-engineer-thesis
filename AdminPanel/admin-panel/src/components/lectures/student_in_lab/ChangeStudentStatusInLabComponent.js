import React, { Component } from 'react';
import Axios from 'axios';
import { Button, Checkbox } from '@material-ui/core';

class ChangeStudentStatusInLabComponent extends Component {
    state = {
        enrolled: this.props.enrolled
    }

    handleClick = (id) => {
        console.log("change student id: " + id);
        let currEnrolled = this.state.enrolled;
        this.setState({ enrolled: !currEnrolled })
        this.props.toggle(id);
    }
    render() {
        return (<Checkbox onChange={() => this.handleClick(this.props.student.id)} checked={this.state.enrolled} id={this.props.student.id} />);
    }
}

export default ChangeStudentStatusInLabComponent;