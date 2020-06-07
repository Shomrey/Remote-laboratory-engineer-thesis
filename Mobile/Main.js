import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Home from './Home';
import Settings from './Settings';

const Drawer = createDrawerNavigator();

export default function Main({ navigation }) {
    navigation.setOptions({
        headerLeft: () => (
            <Icon name="menu" size={40} style={styles.menu} onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer())
            }} />
        )
    })

    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    menu: {
        marginStart: 10,
        marginEnd: 10
    },
});
