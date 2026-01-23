import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { PlayCircle, Gamepad2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Choose your learning path today</Text>
            </View>

            <View style={styles.grid}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#EEF2FF' }]}
                    onPress={() => navigation.navigate('VideoList')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#818CF8' }]}>
                        <PlayCircle color="white" size={32} />
                    </View>
                    <Text style={styles.cardTitle}>Video Learning</Text>
                    <Text style={styles.cardDesc}>Watch lessons and complete activities</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#ECFDF5' }]}
                    onPress={() => navigation.navigate('GamesList')}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                        <Gamepad2 color="white" size={32} />
                    </View>
                    <Text style={styles.cardTitle}>Offline Games</Text>
                    <Text style={styles.cardDesc}>Download and play games offline</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Mobile Application Technical Assignment</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 24,
        marginTop: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    grid: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        gap: 20,
    },
    card: {
        padding: 24,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 12,
    },
});

export default HomeScreen;
