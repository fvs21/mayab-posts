import { Colors } from '@/styles/variables';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ThemedSafeAreaViewProps = {
    className?: Object | Array<Object>;
    [x:string]: any;
}

export default function ThemedSafeAreaView({className, ...rest}: ThemedSafeAreaViewProps) {
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    
    return (
        <SafeAreaView style={[styles.container, isDark ? styles.dark : styles.light, className]} {...rest}/>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    dark: {
        backgroundColor: Colors.dark.background
    },
    light: {
        backgroundColor: Colors.light.background
    }
})