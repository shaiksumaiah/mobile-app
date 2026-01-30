import * as FileSystem from 'expo-file-system/legacy';
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

    // Add timeout for download
    const DOWNLOAD_TIMEOUT = 120000; // 2 minutes

    // Use standard downloadAsync instead of deprecated createDownloadResumable
    try {
        console.log(`Starting download from ${url} to ${fileUri}`);

        // Signal start
        if (onProgress) onProgress(0.1);

        const result = await FileSystem.downloadAsync(
            url,
            fileUri,
            {
                headers: {
                    'User-Agent': 'Expo-App',
                    'Accept': 'application/zip, application/octet-stream, */*'
                }
            }
        );

        // Signal completion
        if (onProgress) onProgress(1.0);

        if (!result || !result.uri) {
            throw new Error('Download failed: No file was downloaded');
        }

        const { uri } = result;
        console.log(`Download finished: ${uri}`);

        // Validate that the file was actually downloaded
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            throw new Error('Download failed: File does not exist after download');
        }

        console.log(`Downloaded file size: ${fileInfo.size} bytes`);

        if (fileInfo.size === 0) {
            throw new Error('Download failed: Downloaded file is empty');
        }

        // Ensure target directory exists
        const dirInfo = await FileSystem.getInfoAsync(targetDir);
        if (dirInfo.exists) {
            await FileSystem.deleteAsync(targetDir, { idempotent: true });
        }
        await FileSystem.makeDirectoryAsync(targetDir, { intermediates: true });

        // Unzip the downloaded file
        // CRITICAL: react-native-zip-archive sometimes fails with file:// prefix on some Android versions
        const cleanZipUri = uri.replace('file://', '');
        const cleanTargetDir = targetDir.replace('file://', '');

        console.log(`Unzipping from ${cleanZipUri} to ${cleanTargetDir}`);
        await unzip(cleanZipUri, cleanTargetDir);

        // Delete the zip file to save space
        await FileSystem.deleteAsync(uri, { idempotent: true });

        // Logic to find index.html (it might be inside a subfolder from GitHub)
        // Improved recursive search for index.html
        const findIndexFile = async (dir) => {
            const files = await FileSystem.readDirectoryAsync(dir);

            // First check if index.html is in the current directory
            if (files.includes('index.html')) {
                return `${dir}/index.html`;
            }

            // Otherwise, check subdirectories
            for (const file of files) {
                const fullPath = `${dir}/${file}`;
                const info = await FileSystem.getInfoAsync(fullPath);
                if (info.isDirectory) {
                    const found = await findIndexFile(fullPath);
                    if (found) return found;
                }
            }
            return null;
        };

        let localPath = await findIndexFile(targetDir);

        if (!localPath) {
            throw new Error(`Could not find index.html in the downloaded package at ${targetDir}`);
        }

        console.log(`Successfully located game at: ${localPath}`);
        await markGameAsDownloaded(gameId, localPath);
        return localPath;
    } catch (e) {
        console.error('Detailed Download/Extraction Error:', e);

        // Provide more specific error messages
        let errorMessage = 'Download failed';
        if (e.message.includes('Network')) {
            errorMessage = 'Network error. Please check your internet connection.';
        } else if (e.message.includes('unzip') || e.message.includes('extract')) {
            errorMessage = 'Failed to extract game files. The download may be corrupted.';
        } else if (e.message.includes('index.html')) {
            errorMessage = 'Game files are incomplete or corrupted.';
        } else {
            errorMessage = e.message || 'Unknown error occurred';
        }

        throw new Error(errorMessage);
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
