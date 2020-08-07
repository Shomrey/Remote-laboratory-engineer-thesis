import 'react-native-gesture-handler';
import React from 'react';
import Login from './Login'
import {AuthProvider} from './AuthContext'


export default function App() {
    return (
        <AuthProvider>
            <Login />
        </AuthProvider>
    );
}