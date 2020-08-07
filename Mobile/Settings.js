import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header, Icon} from "react-native-elements";
import {DrawerActions} from "@react-navigation/native";

export default function Settings({ navigation }) {
    return (
        <View style={styles.container}>
            <Header
                leftComponent={
                    <Icon name="menu" size={40} onPress={() => {
                        navigation.dispatch(DrawerActions.toggleDrawer())
                    }} />
                }
                backgroundColor="white"
                containerStyle={{
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                }}
            />
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
    }
});
