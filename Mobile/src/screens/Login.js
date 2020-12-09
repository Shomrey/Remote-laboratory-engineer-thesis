import 'react-native-gesture-handler';
import React, {useContext, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Main from './Main';
import Axios from 'axios';
import {AuthContext} from '../context/AuthContext'

export default function Login() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useContext(AuthContext);
    const [loginFocus, setLoginFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const logOut = () => {
        setIsLoggedIn(false);
        setToken('');
    }

    const logIn = () => {
        setWaitingForResponse(true);

        Axios.post('https://remote-laboratory.herokuapp.com/api/auth/login', {
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
                setLoginFocus(false);
                setPasswordFocus(false);
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
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={
                            require('../../assets/logo_agh.png')
                        }
                    />
                </View>
                <View>
                    <Text style={styles.header}> Remote Laboratory </Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                                      style={styles.inputsWrapper}>
                    <TextInput style={{...styles.input, borderWidth: loginFocus ? 3 : 0}} placeholder="Login" onChangeText={text => setLogin(text)}
                               autoCapitalize={"none"} onFocus={() => setLoginFocus(true)} onBlur={() => setLoginFocus(false)}
                               autoCompleteType={"off"} autoCorrect={false} />
                    <TextInput style={{...styles.input, borderWidth: passwordFocus ? 3 : 0}} placeholder="Password" onChangeText={text => setPassword(text)}
                               secureTextEntry={true} autoCapitalize={"none"} autoCompleteType={"off"}
                               autoCorrect={false} onFocus={() => setPasswordFocus(true)} onBlur={() => setPasswordFocus(false)} />
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={{...styles.button, backgroundColor: waitingForResponse ? 'grey' : 'black'}}
                            disabled={waitingForResponse}
                            onPress={() => logIn()}>
                            {waitingForResponse ?
                                <ActivityIndicator animating={waitingForResponse} size="large" color="#000000"/>
                                :
                                <Text style={styles.buttonText}>Log in</Text>
                            }

                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
                <Text style={styles.errorMessage}> {errorMessage} </Text>
            </View>)

    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#eceff1'
    },
    input: {
        marginBottom: 20,
        padding: 10,
        paddingLeft: 20,
        height: 46,
        borderRadius: 25,
        backgroundColor: '#cfd8dc',
        fontSize: 20,
        borderColor: 'gray'
    },
    inputsWrapper: {
        alignSelf: 'stretch',
        backgroundColor: 'white',
        paddingVertical: 25,
        paddingHorizontal: 15,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10.84,
        borderRadius: 25,
        elevation: 15,
        minHeight: 220,
    },
    buttonWrapper: {
        overflow: "hidden",
        borderRadius: 25,
        alignSelf: 'stretch',
        marginBottom: Platform.OS === 'ios' ? 25 : 0,
    },
    button: {
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "600",
        color: '#eceff1'
    },
    header: {
        marginTop: 20,
        marginBottom: 130,
        textTransform: "uppercase",
        fontWeight: "700",
        fontSize: 18,
        lineHeight: 21,
        letterSpacing: 1,
    },
    logoContainer: {
        margin: 30,
        marginTop: 50,
        height: 150,
        width: 150,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10.84,
        elevation: 15,
        borderRadius: 25
    },
    logo: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
        borderRadius: 25
    },
    errorMessage: {
        color: 'red',
        textAlign: "center",
        fontSize: 18,
        fontWeight: '500',
        marginTop: 15
    }
});
