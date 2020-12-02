import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import Axios from "axios";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import DrawerHeader from "../components/Header";
import LabClassCard from "../components/LabClassCard";
import LabResult from "./LabResult";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator()

export default function Results() {
    return (
        <Stack.Navigator initialRouteName="ResultsContent" mode="modal">
            <Stack.Screen
                name="ResultsContent"
                component={ResultsContent}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="LabResult"
                component={LabResult}
                options={{title: "Laboratory class", headerStyle: {backgroundColor: '#cfd8dc'}}}
            />
        </Stack.Navigator>
    )
}

function ResultsContent({navigation}) {
    const [token, setToken] = useContext(AuthContext);
    const [labs, setLabs] = useState([]);

    const fetchLabs = () => {
        Axios.get('https://remote-laboratory.herokuapp.com/api/users/current/labs',
            {headers: {'Authorization': `Bearer ${token}`}, params: {enrolled: true}})
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
    }

    useEffect(() => {
        fetchLabs();
    }, []);

    return (
        <View>
            <DrawerHeader navigation={navigation}/>
            <ScrollView style={styles.container}>
                <Text style={styles.labsHeader}>
                    View laboratory results
                </Text>
                <View style={styles.labs}>
                    {labs.map(lab => <LabClassCard lab={lab} key={lab.id} navigation={navigation} enroll={true} result={true}/> )}
                </View>
            </ScrollView>
        </View>
    );
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
