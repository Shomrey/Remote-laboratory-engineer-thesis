import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '25ch',
    }

}));

export default function MultilineTextFields(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('Controlled');
    const [state, setState] = React.useState({
        "name": "",
        "surname": "",
        "mail": "",
        "passwordHash": "",
        "userType": ""
    })

    let userTypes = ["admin", "teacher", "student"];
    let adminField = props.isAdmin ?
        <div>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="select-label">User type</InputLabel>
                <Select
                    labelId="select-label"
                    id="select"
                    value={state.userType}
                    onChange={handleChange}
                    name="userType"
                    variant="outlined"
                >
                    {userTypes.map((type, index) => <MenuItem value={index}>{type}</MenuItem>)}
                </Select>
            </FormControl>
        </div> : ""
    /*= props.isAdmin ?
        <div>
            <TextField
                id="outlined-passwordHash"
                label="User type"
                onChange={handleChange}
                rows={1}
                variant="outlined"
                name="userType"
            />
        </div>
        : ""*/


    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        props.passNewUserData(state);
    }

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <div>
                <TextField
                    id="outlined-name"
                    label="Name"
                    rowsMax={1}
                    onChange={handleChange}
                    variant="outlined"
                    name="name"
                />
                <div>
                    <TextField
                        id="outlined-surname"
                        label="Surname"
                        onChange={handleChange}
                        multiline
                        variant="outlined"
                        name="surname"
                    />
                </div>
                <div>
                    <TextField
                        id="outlined-mail"
                        label="Mail"
                        onChange={handleChange}
                        variant="outlined"
                        name="mail"
                    />
                </div>
                <div>
                    <TextField
                        id="outlined-passwordHash"
                        label="Password"
                        onChange={handleChange}
                        rows={1}
                        variant="outlined"
                        name="passwordHash"
                    />
                </div>
                {adminField}


            </div>
        </form>
    );
    /*
                    <div>
                    <TextField
                        id="outlined-userType"
                        label="User type"
                        multiline
                        rowsMax={4}
                        onChange={handleChange}
                        variant="outlined"
                        name="userType"
                    />
                </div>
                */
}