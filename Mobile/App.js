import 'react-native-gesture-handler';
import React from 'react';
import Login from './src/screens/Login'
import {AuthProvider} from './src/context/AuthContext'
import {SourceCodePro_500Medium, useFonts} from "@expo-google-fonts/source-code-pro";
import {AppLoading} from "expo";


export default function App() {
    let [fontsLoaded] = useFonts({
        SourceCodePro_500Medium,
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <AuthProvider>
            <Login/>
        </AuthProvider>
    );
}