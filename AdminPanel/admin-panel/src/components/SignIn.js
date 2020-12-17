import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Axios from 'axios';
import logo from '../resources/agh_logo.jpg';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        "email": "",
        "password": "",
        "failedLogin": ""
    })
    const [failedLogin, setFailedLogin] = React.useState("")

    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });

    }

    function login(evt) {
        evt.preventDefault()
        const url = "https://remote-laboratory.herokuapp.com/api/auth/login";
        let credentials = {
            "mail": state.email,
            "password": state.password
        }
        Axios.post(url, credentials)
            .then(response => {
                console.log(response.status);
                Axios.defaults.headers.common = {
                    "Authorization": "Bearer " + response.data.access_token
                };
                props.tokenPass(response.data.access_token);
                console.log("SignIn token: " + response.data.access_token);
            })
            .catch(error => {
                console.log(error);
                setState({ failedLogin: 'Wrong email or password, try again', email: '', password: '' })
            })

    }

    /*<Avatar alt="Agh logo" src={logo} className={classes.avatar}>

                </Avatar> */
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img src={logo} />

                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        value={state.email}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        value={state.password}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <span>{state.failedLogin}</span>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={login}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </Container>
    );
}