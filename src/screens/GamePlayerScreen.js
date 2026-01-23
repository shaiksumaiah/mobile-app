import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';

const GamePlayerScreen = ({ route, navigation }) => {
    const { game, localUri } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{game.title}</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <X color="#111827" size={24} />
                </TouchableOpacity>
            </View>

            <WebView
                source={{ uri: localUri }}
                style={styles.webview}
                allowFileAccess={true}
                originWhitelist={['*']}
                domStorageEnabled={true}
                javaScriptEnabled={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        padding: 8,
    },
    webview: {
        flex: 1,
    },
});

export default GamePlayerScreen;
