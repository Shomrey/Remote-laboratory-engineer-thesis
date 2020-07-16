import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Settings from './Settings';

const Drawer = createDrawerNavigator();

export default function Main({ navigation }) {

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home} options={{}} />
                <Drawer.Screen name="Settings" component={Settings} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menu: {
        marginStart: 10,
        marginEnd: 10
    },
});
