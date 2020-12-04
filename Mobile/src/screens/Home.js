import 'react-native-gesture-handler';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import LabClassCard from '../components/LabClassCard';
import {createStackNavigator} from '@react-navigation/stack';
import LabClass from './LabClass';
import {AuthContext} from '../context/AuthContext';
import Axios from 'axios';
import DrawerHeader from "../components/Header";

const Stack = createStackNavigator()

export default function Home() {
    return (
        <Stack.Navigator initialRouteName="HomeContent" mode="modal">
            <Stack.Screen
                name="HomeContent"
                component={HomeContent}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="LabClass"
                component={LabClass}
                options={{title: "Laboratory class", headerStyle: {backgroundColor: '#cfd8dc'}}}
            />
        </Stack.Navigator>
    );
}

function HomeContent({navigation}) {
    const [token, setToken] = useContext(AuthContext);
    const [labs, setLabs] = useState([]);

    useEffect(() => {
        Axios.get('https://remote-laboratory.herokuapp.com/api/users/current/labs', {
            headers: {'Authorization': `Bearer ${token}`},
            params: {enrolled: true}
        })
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
        <View style={{backgroundColor: '#eceff1', height: '100%'}}>
            <DrawerHeader navigation={navigation} title="Home"/>
            <Text style={styles.labsHeader}>
                Upcoming laboratory classes
            </Text>
            {
                labs.length > 0 ?
                    <ScrollView style={styles.container}>
                        <View style={styles.labs}>
                            {labs.map(lab => <LabClassCard lab={lab} key={lab.id} navigation={navigation}/>)}
                        </View>
                    </ScrollView>
                    :
                    <View style={styles.container2}>
                        <View style={styles.pageTitle}>
                            <Text>No laboratory classes available</Text>
                        </View>
                    </View>
            }
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
    },
    pageTitle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container2: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#eceff1',
        height: '75%',
    },
});
