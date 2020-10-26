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

export default function MultilineTextFields(props) {
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
        "teacherId": 0
    })

    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        console.log(state);
        props.passNewLectureData(state);
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
                />
                <TextField
                    id="outlined-duration"
                    label="Duration"
                    placeholder="Placeholder"
                    onChange={handleChange}
                    multiline
                    variant="outlined"
                    name="duration"
                />
                <TextField
                    id="outlined-title"
                    label="Title"
                    onChange={handleChange}
                    variant="outlined"
                    name="title"
                />
                <TextField
                    id="outlined-maxStudents"
                    label="Max students"
                    onChange={handleChange}
                    rows={1}
                    variant="outlined"
                    name="maxStudents"
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
                />
                <TextField
                    id="outlined-topology"
                    label="Topology"
                    onChange={handleChange}
                    multiline
                    rowsMax={4}
                    variant="outlined"
                    name="topology"
                />
                <TextField
                    id="outlined-configuration"
                    label="Configuration"
                    onChange={handleChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    name="configuration"
                />
                <TextField
                    id="outlined-description"
                    label="Description"
                    onChange={handleChange}
                    multiline
                    rows={7}
                    variant="outlined"
                    name="description"
                />
            </div>
        </form>
    );
}