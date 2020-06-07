import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Settings() {
    return (
        <View style={styles.container}>
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
