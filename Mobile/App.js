import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Main from './Main';
import Axios from 'axios';

const Stack = createStackNavigator();



export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    return (
        isLoggedIn ?
            <Main />

            :

            (<View style={styles.container}>
                <Text style={styles.header}> Remote Lab </Text>
                <View style={styles.input} >
                    <TextInput placeholder="Login" onChangeText={text => setLogin(text)} />
                </View>
                <View style={styles.input} >
                    <TextInput placeholder="Password" onChangeText={text => setPassword(text)} secureTextEntry={true} />
                </View>
                <View style={styles.button}>
                    <Button title="Log in" color="black" style={styles.button} onPress={() => f_login(login, password)} />
                </View>
            </View>)
    );
}

function f_login(login, password) {
    console.log('f_login called')
    Axios.post('http://localhost:5000/user/login', {
        mail: login,
        password: password
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center"
    },
    input: {
        marginBottom: 20,
        padding: 10,
        height: 40,
        borderWidth: 2,
        borderRadius: 15
    },
    button: {
        overflow: "hidden",
        borderRadius: 15
    },
    header: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: 100,
        textTransform: "uppercase",
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 20
    }
});
