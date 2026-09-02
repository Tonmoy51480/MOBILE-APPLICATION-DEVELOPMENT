// components/student-item.tsx

import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Student } from "../data/students";
import React from "react";

// TypeScript interface — defines exactly what props this component accepts
interface StudentItemProps {
    student: Student;
    onPress: (student: Student) => void;
    isSelected: boolean;
}

export default function StudentItem({ student, onPress, isSelected }: StudentItemProps) {
    return (
        <Pressable
            style={[styles.row, isSelected && styles.rowSelected]}
            onPress={() => onPress(student)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${student.name}, ${student.department}`}
            accessibilityHint="Tap to view full profile"
        >
            {/* Avatar image */}
            <Image
                source={{ uri: student.avatarUrl }}
                style={styles.avatar}
                resizeMode="cover"
                accessibilityLabel={`Profile photo of ${student.name}`}
            />

            {/* Text content */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {student.name}
                </Text>
                <Text style={styles.department} numberOfLines={1}>
                    {student.department}
                </Text>
                <Text style={styles.id}>ID: {student.studentId}</Text>
            </View>

            {/* Chevron indicator */}
            <Text style={styles.chevron}>{isSelected ? "▲" : "▶"}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row", // lay children horizontally
        alignItems: "center", // vertically centre within the row
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    rowSelected: {
        backgroundColor: "#E1F5EE", // highlight when selected
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26, // half of width/height = circle
        marginRight: 14,
    },
    info: {
        flex: 1, // take all remaining horizontal space
    },
    name: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0D1F4E",
        marginBottom: 2,
    },
    department: {
        fontSize: 12,
        color: "#0D9488",
        marginBottom: 2,
    },
    id: {
        fontSize: 11,
        color: "#94A3B8",
    },
    chevron: {
        fontSize: 12,
        color: "#CBD5E1",
        marginLeft: 8,
    },
});
