import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Container } from '@material-ui/core';

class OneLectureDisplay extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        //startingLecture: this.props.labsData,
        currentLecture: {}
    }
    handleChange = (evt) => {
        const value = evt.target.value;
        this.setState({
            ...this.state,
            currentLecture: {
                ...this.state.currentLecture,
                [evt.target.name]: value
            }
        });
        this.props.lectureChange(this.state.currentLecture);
    }

    componentDidMount() {
        this.setState({ currentLecture: this.props.labsData });
    }
    render() {
        let display = "";
        return (
            <form noValidate autoComplete="off" style={{ margin: '8px', width: '25ch' }}>
                <Container>
                    <TextField
                        id="outlined-date"
                        label="Date"
                        rowsMax={1}
                        onChange={this.handleChange}
                        variant="outlined"
                        name="date"
                        defaultValue={this.state.currentLecture.date}
                    />
                    <TextField
                        id="outlined-duration"
                        label="Duration"
                        onChange={this.handleChange}
                        multiline
                        variant="outlined"
                        name="duration"
                        defaultValue={this.state.currentLecture.duration}
                    />
                    <TextField
                        id="outlined-title"
                        label="Title"
                        onChange={this.handleChange}
                        variant="outlined"
                        name="title"
                        defaultValue={this.state.currentLecture.title}
                    />
                    <TextField
                        id="outlined-maxStudents"
                        label="Max students"
                        onChange={this.handleChange}
                        rows={1}
                        variant="outlined"
                        name="maxStudents"
                        defaultValue={this.state.currentLecture.maxStudents}
                    />
                </Container>
                <div>
                    <TextField
                        id="outlined-tasks"
                        label="Tasks"
                        multiline
                        rowsMax={4}
                        onChange={this.handleChange}
                        variant="outlined"
                        name="tasks"
                        defaultValue={this.state.currentLecture.tasks}
                    />
                    <TextField
                        id="outlined-topology"
                        label="Topology"
                        onChange={this.handleChange}
                        multiline
                        rowsMax={4}
                        variant="outlined"
                        name="topology"
                        defaultValue={this.state.currentLecture.topology}
                    />
                    <TextField
                        id="outlined-configuration"
                        label="Configuration"
                        onChange={this.handleChange}
                        multiline
                        rows={4}
                        variant="outlined"
                        name="configuration"
                        defaultValue={this.state.currentLecture.configuration}
                    />
                    <TextField
                        id="outlined-description"
                        label="Description"
                        onChange={this.handleChange}
                        multiline
                        rows={7}
                        variant="outlined"
                        name="description"
                        defaultValue={this.state.currentLecture.description}
                    />
                </div>
            </form>
        );
    }
}
/*<div>
<p>Date: {this.state.currentLecture.date}</p>
<p>Duration: {this.state.currentLecture.duration}</p>
<p>Title: {this.state.currentLecture.title}</p>
<p>Configuration: {this.state.currentLecture.configuration}</p>
<p>Description: {this.state.currentLecture.description}</p>
<p>Tasks: {this.state.currentLecture.tasks}</p>
<p>Topology: {this.state.currentLecture.topology}</p>
<p>Max students: {this.state.currentLecture.maxStudents}</p>
</div>*/



export default OneLectureDisplay;