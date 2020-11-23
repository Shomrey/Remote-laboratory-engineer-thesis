import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import Axios from "axios";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import DrawerHeader from "../components/Header";
import LabClassCard from "../components/LabClassCard";

export default function Enroll({navigation}) {
    const [token, setToken] = useContext(AuthContext);
    const [labs, setLabs] = useState([]);

    useEffect(() => {
        Axios.get('https://remote-laboratory.herokuapp.com/api/users/current/labs',
            {headers: {'Authorization': `Bearer ${token}`}, params: {enrolled: false}})
            .then(function (response) {
                setLabs(response.data);
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
        <View>
            <DrawerHeader navigation={navigation}/>
            <ScrollView style={styles.container}>
                <Text style={styles.labsHeader}>
                    Enroll to laboratories
                </Text>
                <View style={styles.labs}>
                    {labs.map(lab => <LabClassCard lab={lab} key={lab.id} navigation={navigation} enroll={true}/>)}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#eceff1',
        height: '100%'
    },
    labsHeader: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 20,
        marginHorizontal: 15
    },
    labs: {
        flexDirection: "column",
        marginBottom: 130,
    }
});
