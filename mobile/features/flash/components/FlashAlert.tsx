import CheckCircle from "@/components/svgs/CheckCircle";
import CircleX from "@/components/svgs/CircleX";
import InfoCircle from "@/components/svgs/InfoCircle";
import { Colors } from "@/styles/variables";
import React, { useRef } from "react";
import { Animated, Dimensions, Easing, PanResponder, StyleSheet, useColorScheme, View } from "react-native";

export default function FlashAlert({ type, deleteMsg, children }: { type: 'success' | 'error' | 'info', deleteMsg: Function, children: React.ReactNode }) {
    const isDark = useColorScheme() === "dark";
    
    const pan = useRef(new Animated.ValueXY()).current;
    const windowHeight = Dimensions.get("window").height;
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 5,
        onPanResponderMove: (evt, gestureState) => {
          pan.setValue({ x: 0, y: gestureState.dy });
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dy > 60 || gestureState.vy > 0.5) {
            Animated.timing(pan, {
              toValue: { x: 0, y: windowHeight + 50 },
              duration: 600, // increased duration for slower slide down
              easing: Easing.out(Easing.linear),
              useNativeDriver: true,
            }).start(() => deleteMsg());
          } else {
            Animated.timing(pan, {
              toValue: { x: 0, y: 0 },
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start();
          }
        }
      })
    ).current;

    return (
        <Animated.View 
            {...panResponder.panHandlers} 
            style={[
                styles.bottomAlertContainer, 
                { transform: pan.getTranslateTransform() },
                isDark ? styles.darkThemed : styles.lightThemed,
            ]}
        >
            <View>
                {children}
            </View>
            <View>
                {type === 'success' && (
                    <CheckCircle width={20} color={"green"} />
                )} 
                {type === 'error' && (
                    <CircleX width={20} color={"red"} />
                )}
                {type === 'info' && (
                  <InfoCircle width={20} color={isDark ? 'white' : 'black'} />
                )}
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    bottomAlertContainer: {
        zIndex: 1000,
        position: "absolute",
        bottom: 80,
        width: 200,
        left: Dimensions.get("window").width / 2 - 100,
        borderRadius: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 30,
        flexDirection: "row",
        gap: 10,
    },
    darkThemed: {
        backgroundColor: Colors.dark.inputColor,
    },
    lightThemed: {
        backgroundColor: Colors.light.background,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 5

    },
});