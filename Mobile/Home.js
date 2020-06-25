import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LabClassCard from './LabClassCard';
import { createStackNavigator } from '@react-navigation/stack';
import LabClass from './LabClass';
import { Header, Icon } from 'react-native-elements';
import { DrawerActions } from '@react-navigation/native';

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
                options={{title: "Laboratory class"}}
            />
        </Stack.Navigator>
    );
}

function HomeContent({ navigation }) {
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

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 15
    },
    labsHeader: {
        fontSize: 20,
        fontWeight: "700",
    },
    labs: {
        flex: 1,
        flexDirection: "column"
    }
});

const labs = [
    {
        id: 1,
        professor: "dr John Brown",
        name: "Operating systems",
        subject: "Sockets"
    },
    {
        id: 2,
        professor: "dr John Brown",
        name: "Computer networks",
        subject: "Introduction to the IP protocol"
    }
]
