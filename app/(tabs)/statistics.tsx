// app/(tabs)/statistics.tsx

import React from "react";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatBar from "../../components/stat-bar";
import ErrorScreen from "../../components/error-screen";
import { useStudents } from "../../context/students-context";

const BAR_COLOURS = ["#0D9488", "#185FA5", "#7C3AED", "#F59E0B", "#EF4444", "#059669"];

export default function Statistics() {
    const { students, isLoading, error } = useStudents();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0D9488" />
            </View>
        );
    }

    if (error) {
        return <ErrorScreen message={error} />;
    }

    // Derived value 1: department breakdown
    // Only recomputes when students changes.
    const deptStats = useMemo(() => {
        const counts: Record<string, number> = {};
        students.forEach((s) => {
            counts[s.department] = (counts[s.department] ?? 0) + 1;
        });
        return Object.entries(counts)
            .map(([dept, count]) => ({ dept, count }))
            .sort((a, b) => b.count - a.count);
    }, [students]);

    // Derived value 2: top skills ranking
    const topSkills = useMemo(() => {
        const counts: Record<string, number> = {};
        students.forEach((s) => {
            s.skills.forEach((skill) => {
                counts[skill] = (counts[skill] ?? 0) + 1;
            });
        });
        return Object.entries(counts)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [students]);

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryNumber}>{students.length}</Text>
                    <Text style={styles.summaryLabel}>Total Students</Text>
                </View>

                <Text style={styles.sectionTitle}>By Department</Text>
                <View style={styles.card}>
                    {deptStats.map(({ dept, count }, i) => (
                        <StatBar key={dept} label={dept} count={count} total={students.length} colour={BAR_COLOURS[i % BAR_COLOURS.length]} />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Top Skills</Text>
                <View style={styles.card}>
                    {topSkills.map(({ skill, count }, i) => (
                        <View key={skill} style={styles.skillRow}>
                            <Text style={styles.rank}>#{i + 1}</Text>
                            <Text style={styles.skillName}>{skill}</Text>
                            <Text style={styles.skillCount}>
                                {count} student{count !== 1 ? "s" : ""}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F4F8" },
    content: { padding: 16, paddingBottom: 40 },
    summaryCard: { backgroundColor: "#0D1F4E", borderRadius: 14, padding: 24, alignItems: "center", marginBottom: 20 },
    summaryNumber: { fontSize: 48, fontWeight: "800", color: "#FFFFFF" },
    summaryLabel: { fontSize: 14, color: "#CCFBF1", marginTop: 4 },
    sectionTitle: { fontSize: 11, fontWeight: "700", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 4 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    skillRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
    rank: { fontSize: 14, fontWeight: "700", color: "#0D9488", width: 32 },
    skillName: { flex: 1, fontSize: 14, color: "#334155" },
    skillCount: { fontSize: 12, color: "#94A3B8" },
});
