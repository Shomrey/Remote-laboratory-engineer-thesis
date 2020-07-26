import 'react-native-gesture-handler';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Header, Icon} from "react-native-elements";
import {DrawerActions} from "@react-navigation/native";
import {AuthContext} from "./AuthContext";
import Axios from "axios";

export default function Account({navigation}) {
    const [token, setToken] = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [dataDownloaded, setDataDownloaded] = useState(false);

    getUserData(token, dataDownloaded, setDataDownloaded, userData, setUserData);

    return (
        <View style={styles.container}>
            <Header
                leftComponent={
                    <Icon name="menu" size={40} onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }}/>
                }
                backgroundColor="white"
            />
            <View style={styles.content}>
                <Text>
                    {userData ? ('Name: ' + userData.name) : ''}
                </Text>
                <Text>
                    {userData ? ('Surname: ' + userData.surname) : ''}
                </Text>
                <Text>
                    {userData ? ('E-mail: ' + userData.mail) : ''}
                </Text>
                <Text>
                    {userData ? ('Identifier: ' + userData.id) : ''}
                </Text>
                <Text>
                    {userData ? ('Account type: ' + userData.user_type) : ''}
                </Text>
            </View>
        </View>
    );
}

function getUserData(token, dataDownloaded, setDataDownloaded, userData, setUserData) {
    if (!dataDownloaded) {
        Axios.get('http://localhost:5000/user/current', {headers: {'auth-token': token}})
            .then(function (response) {
                setDataDownloaded(true);
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
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    content: {
        flex: 1,
        padding: 15
    }
});
