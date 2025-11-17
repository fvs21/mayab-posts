import { View } from 'react-native';
import { Colors } from '@/styles/variables';
import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

export type ThemedViewProps = {
    className?: Object | Array<Object>;
    [x:string]: any;
}

export default function ThemedView({className, ...rest}: ThemedViewProps) {
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    
    return (
        <View style={[styles.container, isDark ? styles.dark : styles.light, className]} {...rest}/>
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