import 'react-native-gesture-handler';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AuthContext} from "../context/AuthContext";
import Axios from "axios";
import DrawerHeader from "../components/Header";

export default function Account({navigation}) {
    const [token, setToken] = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        Axios.get('https://remote-laboratory.herokuapp.com/users/current', {headers: {'Authorization': `Bearer ${token}`}})
            .then(function (response) {
                setUserData(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log('Failed to authenticate.')
                    } else {
                        console.log('Unknown server error.')
                    }
                } else {
                    console.log('Failed to connect to the server.')
                }
            });
    }, []);

    return (
        <View style={styles.container}>
            <DrawerHeader navigation={navigation}/>
            <View style={styles.content}>
                <Text style={styles.infoHeader}>
                    Account information
                </Text>
                <Text style={{fontSize: 18}}>
                    {userData ? (`Name: ${userData.name} ${userData.surname}`) : ''}
                </Text>
                <Text style={{fontSize: 18}}>
                    {userData ? (`E-mail: ${userData.mail}`) : ''}
                </Text>
                <Text style={{fontSize: 18}}>
                    {userData ? (`Identifier: ${userData.id}`) : ''}
                </Text>
                <Text style={{fontSize: 18}}>
                    {userData ? (`Account type: ${userData.userType}`) : ''}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column"
    },
    content: {
        padding: 15,
    },
    infoHeader: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10
    }
});
