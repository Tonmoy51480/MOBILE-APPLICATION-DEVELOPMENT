// components/error-screen.tsx
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorScreenProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <Pressable
                    style={styles.button}
                    onPress={onRetry}
                    accessibilityRole="button"
                    accessibilityLabel="Try again"
                >
                    <Text style={styles.buttonText}>Try Again</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
        backgroundColor: "#F0F4F8",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#EF4444",
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#0D9488",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
    },
});
