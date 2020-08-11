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
        Axios.get('https://remote-laboratory.herokuapp.com/users/current/labs', {headers: {'Authorization': `Bearer ${token}`}})
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
                    Available labs
                </Text>
                <View style={styles.labs}>
                    {labs.map(lab => <LabClassCard lab={lab} key={lab.id} navigation={navigation}/>)}
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
