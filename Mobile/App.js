import 'react-native-gesture-handler';
import React from 'react';
import Login from './Login'
import {AuthProvider} from './AuthContext'
import {useFonts} from "expo-font";
import {AppLoading} from "expo";


export default function App() {
    return (
        <AuthProvider>
            <Login />
        </AuthProvider>
    );
}