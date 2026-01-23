import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unzip } from 'react-native-zip-archive';

const GAMES_DIR = `${FileSystem.documentDirectory}games/`;
const STORAGE_KEY = '@downloaded_games';

export const initFileService = async () => {
    const dirInfo = await FileSystem.getInfoAsync(GAMES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(GAMES_DIR, { intermediates: true });
    }
};

export const downloadGame = async (gameId, url, onProgress) => {
    const fileUri = `${GAMES_DIR}${gameId}.zip`;
    const targetDir = `${GAMES_DIR}${gameId}`;

    const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        (downloadProgress) => {
            const progress =
                downloadProgress.totalBytesWritten /
                downloadProgress.totalBytesExpectedToWrite;
            if (onProgress) onProgress(progress);
        }
    );

    try {
        const { uri } = await downloadResumable.downloadAsync();

        // Ensure target directory exists
        const dirInfo = await FileSystem.getInfoAsync(targetDir);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(targetDir, { idempotent: true });
        }
        await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });

        // Unzip the downloaded file
        await unzip(uri, targetDir);

        // Delete the zip file to save space
        await FileSystem.deleteAsync(uri, { idempotent: true });

        // Logic to find index.html (it might be inside a subfolder from GitHub)
        let localPath = `${targetDir}/index.html`;
        const check = await FileSystem.getInfoAsync(localPath);

        if (!check.exists) {
            const files = await FileSystem.readDirectoryAsync(targetDir);
            const mainDir = files.find(f => !f.startsWith('.') && f !== 'index.html');
            if (mainDir) {
                const subPath = `${targetDir}/${mainDir}/index.html`;
                const subCheck = await FileSystem.getInfoAsync(subPath);
                if (subCheck.exists) {
                    localPath = subPath;
                }
            }
        }

        await markGameAsDownloaded(gameId, localPath);
        return localPath;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

const markGameAsDownloaded = async (gameId, uri) => {
    const current = await getDownloadedGames();
    current[gameId] = uri;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

export const getDownloadedGames = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

export const deleteGame = async (gameId) => {
    const current = await getDownloadedGames();
    if (current[gameId]) {
        // Delete the entire game directory
        const gameDir = current[gameId].substring(0, current[gameId].lastIndexOf('/'));
        await FileSystem.deleteAsync(gameDir, { idempotent: true });
        delete current[gameId];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
};
