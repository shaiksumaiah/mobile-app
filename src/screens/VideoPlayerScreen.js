import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { X, Gamepad2, PenTool, Sparkles, Play, Coins } from 'lucide-react-native';
import { logEvent } from '../services/AnalyticsService';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {
    const { topic } = route.params;
    const videoRef = useRef(null);

    const [status, setStatus] = useState({});
    const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
    const [lastActivityTime, setLastActivityTime] = useState(0);
    const [completedActivities, setCompletedActivities] = useState(0);
    const [coins, setCoins] = useState(0);

    // Interval: 1 minute (60 seconds)
    const ACTIVITY_INTERVAL = 60;
    // For demo, assume max 5 activities
    const TOTAL_ACTIVITIES = 5;

    const handlePlaybackStatusUpdate = (playbackStatus) => {
        setStatus(playbackStatus);

        if (playbackStatus.isPlaying) {
            const currentTimeInSec = Math.floor(playbackStatus.positionMillis / 1000);

            if (currentTimeInSec > 0 &&
                currentTimeInSec % ACTIVITY_INTERVAL === 0 &&
                currentTimeInSec > lastActivityTime) {

                videoRef.current.pauseAsync();
                setLastActivityTime(currentTimeInSec);
                setIsActivityModalVisible(true);
                logEvent('video_paused_for_activity', { topicId: topic.id, time: currentTimeInSec });
            }
        }
    };

    const completeActivity = (activityType) => {
        setIsActivityModalVisible(false);
        setCompletedActivities(prev => prev + 1);
        setCoins(prev => prev + 10);
        videoRef.current.playAsync();
        logEvent('activity_completed', {
            topicId: topic.id,
            activityType,
            totalCompleted: completedActivities + 1
        });
    };

    // UI Helper for timeline dots
    const renderTimelineDots = () => {
        const dots = [];
        for (let i = 1; i <= TOTAL_ACTIVITIES; i++) {
            const isActive = completedActivities >= i;
            dots.push(
                <View
                    key={i}
                    style={[styles.dot, isActive && styles.activeDot]}
                />
            );
        }
        return dots;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.videoHeader}>
                <Text style={styles.headerTitle}>{topic.title}</Text>
                <Text style={styles.headerSubtitle}>Interactive Story Experience</Text>
                <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => navigation.goBack()}
                >
                    <X color="#4B5563" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: topic.videoUrl }}
                    useNativeControls
                    resizeMode="contain"
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
            </View>

            <View style={styles.interactiveLayer}>
                <View style={styles.timelineContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(status.positionMillis / status.durationMillis) * 100 || 0}%` }]} />
                    </View>
                    <View style={styles.dotOverlay}>
                        {renderTimelineDots()}
                    </View>
                </View>

                <View style={styles.bottomStats}>
                    <Text style={styles.bottomLabel}>Choices made: {completedActivities}/{TOTAL_ACTIVITIES}</Text>
                    <View style={styles.coinContainer}>
                        <Coins color="#F59E0B" size={16} />
                        <Text style={styles.coinText}>{coins} coins earned</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.details}>
                <Text style={styles.title}>About this Lesson</Text>
                <Text style={styles.description}>{topic.description}</Text>
            </ScrollView>

            {/* Activity Modal */}
            <Modal
                visible={isActivityModalVisible}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalBadge}>🎉 Choice Time!</Text>
                        <Text style={styles.modalTitle}>What would you like to do now?</Text>

                        <View style={styles.activityGrid}>
                            <TouchableOpacity style={styles.activityCard} onPress={() => completeActivity('Quick Game')}>
                                <View style={[styles.activityIcon, { backgroundColor: '#FEE2E2' }]}>
                                    <Gamepad2 color="#EF4444" size={28} />
                                </View>
                                <Text style={styles.activityTitle}>Quick Game</Text>
                                <Text style={styles.activityDesc}>Pop balloons!</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.activityCard} onPress={() => completeActivity('Practice Bite')}>
                                <View style={[styles.activityIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <PenTool color="#F59E0B" size={28} />
                                </View>
                                <Text style={styles.activityTitle}>Practice Bite</Text>
                                <Text style={styles.activityDesc}>Quick quiz!</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.activityCard} onPress={() => completeActivity('Fun Activity')}>
                                <View style={[styles.activityIcon, { backgroundColor: '#E0F2FE' }]}>
                                    <Sparkles color="#0EA5E9" size={28} />
                                </View>
                                <Text style={styles.activityTitle}>Fun Activity</Text>
                                <Text style={styles.activityDesc}>Do a fun action!</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.activityCard} onPress={() => completeActivity('Keep Watching')}>
                                <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <Play color="#10B981" size={24} fill="#10B981" />
                                </View>
                                <Text style={styles.activityTitle}>Keep Watching</Text>
                                <Text style={styles.activityDesc}>Continue story</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    videoHeader: {
        padding: 16,
        backgroundColor: 'white',
        flexDirection: 'column',
        position: 'relative',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    closeIcon: {
        position: 'absolute',
        right: 16,
        top: 20,
    },
    videoContainer: {
        width: '100%',
        height: height * 0.3,
        backgroundColor: 'black',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    interactiveLayer: {
        padding: 16,
        backgroundColor: 'white',
    },
    timelineContainer: {
        height: 20,
        justifyContent: 'center',
        marginBottom: 8,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        width: '100%',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#F59E0B',
        borderRadius: 2,
    },
    dotOverlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
    activeDot: {
        backgroundColor: '#10B981',
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'white',
    },
    bottomStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    coinText: {
        fontSize: 12,
        color: '#F59E0B',
        fontWeight: '700',
    },
    details: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 12,
        lineHeight: 24,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalBadge: {
        fontSize: 14,
        fontWeight: '700',
        color: '#818CF8',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 24,
    },
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    activityCard: {
        width: (width * 0.85 - 48 - 12) / 2,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    activityIcon: {
        width: 50,
        height: 50,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    activityDesc: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default VideoPlayerScreen;
