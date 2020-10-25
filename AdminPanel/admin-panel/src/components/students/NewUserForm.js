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
        "name": "",
        "surname": "",
        "mail": "",
        "passwordHash": "",
        "userType": ""
    })

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