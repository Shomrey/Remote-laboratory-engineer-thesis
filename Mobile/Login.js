import 'react-native-gesture-handler';
import React, {useState, useContext} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Main from './Main';
import Axios from 'axios';
import {AuthContext} from './AuthContext'

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useContext(AuthContext);

    const logOut = () => {
        setIsLoggedIn(false);
        setToken('');
    }

    const logIn = () => {
        setWaitingForResponse(true);

        Axios.post('http://localhost:3000/auth/login', {
            mail: login,
            password: password
        })
            .then(function (response) {
                setToken(response.data['access_token']);
                setIsLoggedIn(true);
                setWaitingForResponse(false);
                setLogin('');
                setPassword('');
                setErrorMessage('');
            })
            .catch(function (error) {
                setWaitingForResponse(false);
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('Incorrect login or password.')
                    } else {
                        setErrorMessage('Unknown server error.')
                    }
                } else {
                    setErrorMessage('Failed to connect to the server.')
                }
            });
    }

    return (
        isLoggedIn ?
            <Main logOut={logOut}/>

            :

            (<View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={
                        require('./assets/logo_agh.png')
                    }
                />
                <Text style={styles.header}> Remote Laboratory </Text>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View style={styles.input}>
                        <TextInput placeholder="Login" onChangeText={text => setLogin(text)} autoCapitalize={"none"}
                                   autoCompleteType={"off"} autoCorrect={false}/>
                    </View>
                    <View style={styles.input}>
                        <TextInput placeholder="Password" onChangeText={text => setPassword(text)}
                                   secureTextEntry={true} autoCapitalize={"none"} autoCompleteType={"off"}
                                   autoCorrect={false}/>
                    </View>
                </KeyboardAvoidingView>
                <View style={styles.buttonWrapper}>
                    <Button title="Log in" color="black" style={styles.button} disabled={waitingForResponse}
                            onPress={() => logIn()}/>
                </View>
                <Text style={styles.errorMessage}> {errorMessage} </Text>
                <ActivityIndicator style={styles.loader} animating={waitingForResponse} size="large" color="#000000"/>
            </View>)

    );
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
