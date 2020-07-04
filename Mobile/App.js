import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, Image } from 'react-native';
import Main from './Main';
import Axios from 'axios';


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    return (
        isLoggedIn ?
            <Main />

            :

            (<View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={
                        require('./assets/logo_agh.png')
                    }
                />
                <Text style={styles.header}> Remote Laboratory </Text>
                <View style={styles.input} >
                    <TextInput placeholder="Login" onChangeText={text => setLogin(text)} />
                </View>
                <View style={styles.input} >
                    <TextInput placeholder="Password" onChangeText={text => setPassword(text)} secureTextEntry={true} />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button title="Log in" color="black" style={styles.button} disabled={waitingForResponse} onPress={() => loginFunction(login, password, setIsLoggedIn, setWaitingForResponse, setErrorMessage)} />
                </View>
                <Text style={styles.errorMessage}> {errorMessage} </Text>
                <ActivityIndicator style={styles.loader} animating={waitingForResponse} size="large" color="#000000" />
            </View>)
    );
}

function loginFunction(login, password, loginSuccessfulHandler, waitingForResponseHandler, errorMessageHandler) {
    waitingForResponseHandler(true);

    Axios.post('http://localhost:5000/user/login', {
        mail: login,
        password: password
    })
        .then(function (response) {
            loginSuccessfulHandler(true);
        })
        .catch(function (error) {
            waitingForResponseHandler(false);
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessageHandler('Incorrect login or password.')
                } else {
                    errorMessageHandler('Unknown server error.')
                }
            } else {
                errorMessageHandler('Failed to connect to the server.')
            }
        });
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
    },
    input: {
        marginBottom: 20,
        padding: 10,
        height: 46,
        borderWidth: 2,
        borderRadius: 15
    },
    buttonWrapper: {
        overflow: "hidden",
        borderRadius: 15,
    },
    button: {
        height: 46
    },
    header: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 100,
        textTransform: "uppercase",
        fontFamily: "Roboto",
        fontWeight: "700",
        fontSize: 18,
        lineHeight: 21,
        letterSpacing: 1,
    },
    loader: {
        marginTop: 10
    },
    logo: {
        marginBottom: 20,
        height: 150,
        width: 150,
        marginLeft: "auto",
        marginRight: "auto"
    },
    errorMessage: {
        margin: 10,
        color: 'red',
        textAlign: "center"
    }
});
