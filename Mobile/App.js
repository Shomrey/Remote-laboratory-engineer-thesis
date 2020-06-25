import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Main from './Main';

const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        isLoggedIn ?
           <Main />

            :

            (<View style={styles.container}>
                <Text style={styles.header}> Remote Lab </Text>
                <View style={styles.input} >
                    <TextInput placeholder="Login" />
                </View>
                <View style={styles.input} >
                    <TextInput placeholder="Password" secureTextEntry={true} />
                </View>
                <View style={styles.button}>
                    <Button title="Log in" color="black" style={styles.button} onPress={() => setIsLoggedIn(true)} />
                </View>
            </View>)
    );
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
