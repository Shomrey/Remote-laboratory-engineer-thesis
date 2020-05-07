import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function Home({ navigation }) {
    return (
        <View style={styles.pageTitle}>
            <Text>
                Home page
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pageTitle: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
