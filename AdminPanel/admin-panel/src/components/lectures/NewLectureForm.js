import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Container, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
            justifyContent: "center",
            textAlign: "center",
            //backgroundColor: "yellow"
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '25ch',
    },
    container: {
        //backgroundColor: "red",
        width: "100%"
    }
}));

export default function NewLectureForm(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [state, setState] = React.useState({
        "date": "",
        "duration": 0,
        "title": "",
        "configuration": "",
        "description": "",
        "tasks": "",
        "topology": "",
        "maxStudents": 0,
        "teacherId": 0,
        "enrollmentCode": "",
        "collectResultsCommands": "",
        "expectedConfiguration": ""
    })

    function handleChange(evt) {
        const value = evt.target.value;
        let tmpState = state;
        setState({
            ...state,
            [evt.target.name]: value
        });
        tmpState[evt.target.name] = value
        console.log(state);
        props.passNewLectureData(tmpState);
    }

    return (
        <div className={classes.container}>


            <form className={classes.root} noValidate autoComplete="off" text-align="center" justify-content="center" align-items="center">
                <Container>
                    <TextField
                        id="outlined-date"
                        label="Date"
                        rowsMax={1}
                        onChange={handleChange}
                        placeholder="Date in format dd.mm.yyyy"
                        variant="outlined"
                        name="date"
                    />
                </Container>
                <Container>
                    <TextField
                        fullWidth={true}
                        id="outlined-duration"
                        label="Duration"
                        placeholder="Duration in minutes"
                        onChange={handleChange}
                        multiline
                        variant="outlined"
                        name="duration"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-title"
                        label="Title"
                        onChange={handleChange}
                        variant="outlined"
                        name="title"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-maxStudents"
                        label="Max students"
                        onChange={handleChange}
                        rows={1}
                        variant="outlined"
                        name="maxStudents"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-tasks"
                        label="Tasks"
                        multiline
                        rowsMax={6}
                        rows={4}
                        onChange={handleChange}
                        variant="outlined"
                        name="tasks"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-topology"
                        label="Topology"
                        onChange={handleChange}
                        multiline
                        rowsMax={6}
                        rows={4}
                        variant="outlined"
                        name="topology"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-configuration"
                        label="Configuration"
                        onChange={handleChange}
                        multiline
                        rowsMax={6}
                        rows={4}
                        variant="outlined"
                        name="configuration"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-description"
                        label="Description"
                        onChange={handleChange}
                        multiline
                        rowsMax={6}
                        rows={4}
                        variant="outlined"
                        name="description"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-enrollmentCode"
                        label="Enrollment code"
                        rowsMax={1}
                        onChange={handleChange}
                        placeholder="Code used by students to self-enroll to laboratory"
                        variant="outlined"
                        name="enrollmentCode"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-collectResultsCommands"
                        label="Results commands"
                        rowsMax={1}
                        onChange={handleChange}
                        placeholder="Commands for switch that return final configurtion"
                        variant="outlined"
                        name="collectResultsCommands"
                    />
                </Container>
                <Container>
                    <TextField
                        id="outlined-expectedConfiguration"
                        label="Expected configuration"
                        onChange={handleChange}
                        multiline
                        rows={7}
                        variant="outlined"
                        name="expectedConfiguration"
                        defaultValue={state.expectedConfiguration}
                    />
                </Container>
                <Container>
                    <FormControl variant="filled" className={classes.formControl}>
                        <InputLabel id="select-label">Teacher</InputLabel>
                        <Select
                            labelId="select-label"
                            id="select"
                            value={state.teacherId}
                            //defaultValue={props.teachers.filter(teacher => teacher.id === state.teacherId)[0]}
                            onChange={handleChange}
                            name="teacherId"
                            variant="outlined"
                        >
                            {props.teachers.map(teacher => <MenuItem value={teacher.id}>{teacher.name} {teacher.surname}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Container>

            </form>
        </div>
    );
}