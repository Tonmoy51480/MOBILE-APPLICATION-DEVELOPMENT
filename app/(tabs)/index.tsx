import AddStudentForm from "@/components/add-student-form";
import SearchBar from "@/components/search-bar";
import StudentDetail from "@/components/student-detail";
import StudentItem from "@/components/student-item";
import { useDebounce } from "@/hooks/use-debounce";
import { Student, STUDENTS } from "@/data/students";
import ErrorScreen from "../../components/error-screen";
// Add useRef and useEffect to the import
import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { Text, StyleSheet, View, FlatList, Pressable, ActivityIndicator } from "react-native";

import { router } from "expo-router";
import { useStudents } from "../../context/students-context";
import { SafeAreaView } from "react-native-safe-area-context";

// app/(tabs)/index.tsx — import TextInput (not to be used as part of UI, but the type is needed for useRef)
import { TextInput } from "react-native";

export default function HomePage() {
    const [query, setQuery] = useState<string>("");
    // Debounce the query — filter only runs 300ms after typing stops
    const debouncedQuery = useDebounce(query, 300);

    const searchRef = useRef<TextInput>(null);
    // Focus the search bar 300ms after mount (lets animation finish)
    useEffect(() => {
        const timer = setTimeout(() => {
            searchRef.current?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }, []); // [] — run once on mount only

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Read students directly from the global context
    const { students, isLoading, error } = useStudents();
    const [retryKey, setRetryKey] = useState(0);

    const handleRetry = useCallback(() => {
        setRetryKey((k) => k + 1); // changing this key will re-mount the provider
    }, []);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0D9488" />
                <Text style={styles.loadingHint}>Loading students...</Text>
            </View>
        );
    }

    if (error) {
        return <ErrorScreen message={error} onRetry={handleRetry} />;
    }

    // No longer needed
    // const handleNewStudent = (newStudent: Student) => {
    //     // Lifting state up in action: the form hands the new
    //     // student back to this parent screen, which prepends
    //     // it to the list.
    //     setStudents((prev) => [newStudent, ...prev]);
    //     setShowForm(false);
    // };

    // Only recomputes when students or debouncedQuery changes.
    // Tapping a student (setSelectedStudent) does NOT re-run this.
    const filtered = useMemo(() => {
        return students.filter((s) => s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) || s.department.toLowerCase().includes(debouncedQuery.toLowerCase()));
    }, [students, debouncedQuery]);

    const handleSelect = (student: Student) => {
        setSelectedStudent((prev) => (prev?.id === student.id ? null : student));
    };

    const EmptyList = useCallback(() => {
        if (query.length > 0) {
            return (
                <View style={styles.empty}>
                    <Text style={styles.emptyTitle}>No results</Text>
                    <Text style={styles.emptySub}>
                        No students match "{debouncedQuery}"
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No students yet</Text>
                <Text style={styles.emptySub}>
                    Tap + Add to add the first student
                </Text>
            </View>
        );
    }, [query, debouncedQuery]);

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Student Directory</Text>
                {/* Navigate to the AddStudent screen — no prop passing needed */}
                <Pressable style={styles.addButton} onPress={() => router.push("/(tabs)/add-student")}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                </Pressable>
            </View>

            <SearchBar 
				// NEW: apply the useRef here:
				ref={searchRef}
				value={query} 
				onChangeText={setQuery} 
			/>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StudentItem student={item} onPress={handleSelect} isSelected={selectedStudent?.id === item.id} />}
                ListEmptyComponent={EmptyList}
            />

            {selectedStudent && <StudentDetail student={selectedStudent} onRemoved={() => setSelectedStudent(null)} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F4F8" },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#0D1F4E",
    },
    title: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
    addButton: {
        backgroundColor: "#0D9488",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
    empty: {
        flex: 1,
        alignItems: "center",
        paddingTop: 80,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 6,
    },
    emptySub: {
        fontSize: 13,
        color: "#94A3B8",
        textAlign: "center",
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingHint: { marginTop: 12, color: "#64748B", fontSize: 13 },
});
