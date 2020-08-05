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
                <Text style={styles.infoHeader}>
                    Account information
                </Text>
                <Text style={{ fontSize: 18}}>
                    {userData ? (`Name: ${userData.name} ${userData.surname}`) : ''}
                </Text>
                <Text style={{ fontSize: 18}}>
                    {userData ? (`E-mail: ${userData.mail}`) : ''}
                </Text>
                <Text style={{ fontSize: 18}}>
                    {userData ? (`Identifier: ${userData.id}`) : ''}
                </Text>
                <Text style={{ fontSize: 18}}>
                    {userData ? (`Account type: ${userData.userType}`) : ''}
                </Text>
            </View>
        </View>
    );
}

function getUserData(token, dataDownloaded, setDataDownloaded, userData, setUserData) {
    if (!dataDownloaded) {
        Axios.get('http://localhost:3000/users/current', {headers: {'Authorization': `Bearer ${token}`}})
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
