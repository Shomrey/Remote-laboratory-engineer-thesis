import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function ChangeLectureForm(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [state, setState] = React.useState({
        "id": props.lab.id,
        "date": props.lab.date,
        "duration": props.lab.duration,
        "title": props.lab.title,
        "configuration": props.lab.configuration,
        "description": props.lab.description,
        "tasks": props.lab.tasks,
        "topology": props.lab.topology,
        "maxStudents": props.lab.maxStudents,
        "teacherId": props.lab.teacher.id
    })

    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });

        props.lectureChange(state);
    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    id="outlined-date"
                    label="Date"
                    rowsMax={1}
                    onChange={handleChange}
                    variant="outlined"
                    name="date"
                    defaultValue={state.date}
                />
                <TextField
                    id="outlined-duration"
                    label="Duration"
                    placeholder="Placeholder"
                    onChange={handleChange}
                    multiline
                    variant="outlined"
                    name="duration"
                    defaultValue={state.duration}
                />
                <TextField
                    id="outlined-title"
                    label="Title"
                    onChange={handleChange}
                    variant="outlined"
                    name="title"
                    defaultValue={state.title}
                />
                <TextField
                    id="outlined-maxStudents"
                    label="Max students"
                    onChange={handleChange}
                    rows={1}
                    variant="outlined"
                    name="maxStudents"
                    defaultValue={state.maxStudents}
                />
            </div>
            <div>
                <TextField
                    id="outlined-tasks"
                    label="Tasks"
                    multiline
                    rowsMax={4}
                    onChange={handleChange}
                    variant="outlined"
                    name="tasks"
                    defaultValue={state.tasks}
                />
                <TextField
                    id="outlined-topology"
                    label="Topology"
                    onChange={handleChange}
                    multiline
                    rowsMax={4}
                    variant="outlined"
                    name="topology"
                    defaultValue={state.topology}
                />
                <TextField
                    id="outlined-configuration"
                    label="Configuration"
                    onChange={handleChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    name="configuration"
                    defaultValue={state.configuration}
                />
                <TextField
                    id="outlined-description"
                    label="Description"
                    onChange={handleChange}
                    multiline
                    rows={7}
                    variant="outlined"
                    name="description"
                    defaultValue={state.description}
                />
            </div>
        </form>
    );
}