import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_KEY = '@app_analytics';

export const logEvent = async (eventName, params = {}) => {
    const timestamp = new Date().toISOString();
    const event = { eventName, params, timestamp };

    try {
        const existingData = await AsyncStorage.getItem(ANALYTICS_KEY);
        const logs = existingData ? JSON.parse(existingData) : [];
        logs.push(event);
        await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(logs.slice(-100))); // Keep last 100 events
        console.log(`[Analytics] ${eventName}:`, params);
    } catch (error) {
        console.error('[Analytics Error]', error);
    }
};

export const getEvents = async () => {
    const data = await AsyncStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
};
