import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Download, Play, CheckCircle2, Gamepad2 } from 'lucide-react-native';
import { GAMES } from '../data/dummyData';
import { downloadGame, getDownloadedGames, initFileService } from '../services/FileService';
import { logEvent } from '../services/AnalyticsService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const GamesListScreen = ({ navigation }) => {
    const [downloadedGames, setDownloadedGames] = useState({});
    const [downloading, setDownloading] = useState({});
    const [progress, setProgress] = useState({});

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await initFileService();
        const downloaded = await getDownloadedGames();
        setDownloadedGames(downloaded);
    };

    const handleDownload = async (game) => {
        setDownloading(prev => ({ ...prev, [game.id]: true }));
        logEvent('game_download_started', { gameId: game.id, title: game.title });

        try {
            const url = game.downloadUrl.startsWith('http') ? game.downloadUrl : 'https://raw.githubusercontent.com/gabrielecirulli/2048/master/index.html';

            const uri = await downloadGame(game.id, url, (p) => {
                setProgress(prev => ({ ...prev, [game.id]: p }));
            });

            setDownloadedGames(prev => ({ ...prev, [game.id]: uri }));
            logEvent('game_download_success', { gameId: game.id });
        } catch (error) {
            logEvent('game_download_failed', { gameId: game.id, error: error.message });
            Alert.alert('Download Failed', 'Could not download the game. Please try again.');
        } finally {
            setDownloading(prev => ({ ...prev, [game.id]: false }));
        }
    };

    const renderItem = ({ item }) => {
        const isDownloaded = !!downloadedGames[item.id];
        const isDownloading = downloading[item.id];
        const currentProgress = progress[item.id] || 0;

        return (
            <View style={styles.card}>
                <View style={styles.thumbnailContainer}>
                    <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                    {isDownloaded && (
                        <View style={styles.statusBadge}>
                            <CheckCircle2 color="#10B981" size={14} />
                            <Text style={styles.statusText}>Ready</Text>
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.actions}>
                        {isDownloaded ? (
                            <TouchableOpacity
                                style={[styles.button, styles.playButton]}
                                onPress={() => {
                                    logEvent('game_launched', { gameId: item.id });
                                    navigation.navigate('GamePlayer', { game: item, localUri: downloadedGames[item.id] });
                                }}
                            >
                                <Play color="white" size={16} fill="white" />
                                <Text style={styles.buttonText}>PLAY</Text>
                            </TouchableOpacity>
                        ) : isDownloading ? (
                            <View style={styles.progressContainer}>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${currentProgress * 100}%` }]} />
                                </View>
                                <Text style={styles.progressText}>{Math.round(currentProgress * 100)}%</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.downloadButton]}
                                onPress={() => handleDownload(item)}
                            >
                                <Download color="white" size={16} />
                                <Text style={styles.buttonText}>DOWNLOAD</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Gamepad2 color="#818CF8" size={24} />
                    <Text style={styles.headerTitle}>Games</Text>
                </View>
                <Text style={styles.headerSubtitle}>Discover and play educational games</Text>
            </View>

            <FlatList
                data={GAMES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToInterval={CARD_WIDTH + 20}
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0EA5E9', // Vibrant blue background as in ref image
    },
    header: {
        padding: 24,
        paddingTop: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    listContent: {
        paddingLeft: 24,
        paddingRight: 100, // Extra space at the end
        paddingTop: 20,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: 'rgba(255,255,255,0.2)', // Glassmorphism effect
        borderRadius: 32,
        marginRight: 20,
        padding: 20,
        height: 380,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    thumbnailContainer: {
        width: '100%',
        height: 180,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        color: '#10B981',
        fontWeight: '800',
    },
    info: {
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
    },
    desc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    actions: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 20,
        gap: 8,
    },
    downloadButton: {
        backgroundColor: '#3B82F6',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    playButton: {
        backgroundColor: '#10B981',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '800',
        color: 'white',
    },
});

export default GamesListScreen;
