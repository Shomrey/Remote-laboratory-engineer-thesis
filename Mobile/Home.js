import 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LabClassCard from './LabClassCard';
import { createStackNavigator } from '@react-navigation/stack';
import LabClass from './LabClass';
import { Header, Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';
import { AuthContext } from './AuthContext';
import Axios from 'axios';

const Stack = createStackNavigator()

export default function Home() {
    return (
        <Stack.Navigator initialRouteName="HomeContent" mode="modal">
            <Stack.Screen
                name="HomeContent"
                component={HomeContent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="LabClass"
                component={LabClass}
                options={{ title: "Laboratory class" }}
            />
        </Stack.Navigator>
    );
}

function HomeContent({ navigation }) {
    const [token, setToken] = useContext(AuthContext);
    const [labs, setLabs] = useState([]);
    const [labsDownloaded, setLabsDownloaded] = useState(false);

    getUsersLabs(token, labs, setLabs, labsDownloaded, setLabsDownloaded);

    return (
        <View>
            <Header
                leftComponent={
                    <Icon name="menu" size={40} onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }} />
                }
                backgroundColor="white"
            />
            <View style={styles.container}>
                <Text style={styles.labsHeader}>
                    Available labs
                </Text>
                <View style={styles.labs}>
                    {labs.map(lab => <LabClassCard lab={lab} key={lab.id} navigation={navigation} />)}
                </View>
            </View>
        </View>
    )
}

function getUsersLabs(token, labs, setLabs, labsDownloaded, setLabsDownloaded) {
    console.log(labs)
    if (!labsDownloaded) {
        Axios.get('http://localhost:5000/user/labs', { headers: { 'auth-token': token } })
            .then(function (response) {
                setLabsDownloaded(true);
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
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 15,
    },
    labsHeader: {
        fontSize: 20,
        fontWeight: "700",
    },
    labs: {
        flexDirection: "column",
    }
});
