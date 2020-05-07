import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function Settings({ navigation }) {
    return (
        <View style={styles.container}>
            <Icon name="menu" size={40} style={styles.menu} onPress={() => { navigation.toggleDrawer() }} />
            <View style={styles.pageTitle}>
                <Text>
                    Settings
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    pageTitle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    menu: {
        marginTop: 40,
        marginStart: 10
    }
});
