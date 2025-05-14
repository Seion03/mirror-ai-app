import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ApiVideoLiveStreamMethods, ApiVideoLiveStreamView } from '@api.video/react-native-livestream';
import { auth, db } from '../../scripts/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const App = () => {
    const ref = useRef<ApiVideoLiveStreamMethods | null>(null);
    const [streaming, setStreaming] = useState(false);
    const [counts, setCounts] = useState({ 
        correct: 0, 
        incorrect: 0 
    });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [sessionId, setSessionId] = useState<string>('');

    useEffect(() => {
        // Set up real-time listener for counts and suggestions
        const unsubscribe = onSnapshot(
            doc(db, 'squats', 'latest_counts'),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setCounts({
                        correct: data.correct_count || 0,
                        incorrect: data.incorrect_count || 0
                    });
                    setSuggestions(data.suggestions || []);
                    setSessionId(data.session_id || '');
                }
            },
            (error) => {
                console.error("Error fetching data:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {/* Video Stream */}
            <ApiVideoLiveStreamView
                style={styles.videoStream}
                ref={ref}
                camera="front"
                enablePinchedZoom={true}
                video={{
                    fps: 30,
                    resolution: '720p',
                    bitrate: 2 * 1024 * 1024, // 2 Mbps
                    gopDuration: 1, // 1 second
                }}
                audio={{
                    bitrate: 128000,
                    sampleRate: 44100,
                    isStereo: true,
                }}
                isMuted={false}
                onConnectionSuccess={() => {}}
                onConnectionFailed={(e) => console.error(e)}
                onDisconnect={() => {}}
            />

            {/* Boxes for displaying feedback */}
            <View style={styles.infoContainer}>
                <View style={styles.box}>
                    <Text style={styles.boxText}>✅ Correct: {counts.correct}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxText}>❌ Incorrect: {counts.incorrect}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxText}>💡 Suggestions</Text>
                    {suggestions.map((suggestion, index) => (
                        <Text key={index} style={styles.suggestionText}>
                            • {suggestion}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Streaming Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: streaming ? 'red' : 'white' }]}
                    onPress={() => {
                        if (streaming) {
                            ref.current?.stopStreaming();
                            setStreaming(false);
                        } else {
                            try {
                                const userId = auth.currentUser?.uid || 'anonymous';
                                console.log('userId:', userId);
                                
                                // Construct RTMP URL with query parameter
                                const rtmpUrl = "rtmp://192.168.143.81/live";
                                
                                ref.current?.startStreaming(
                                    'test', 
                                    rtmpUrl
                                );
                                setStreaming(true);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoStream: {
        flex: 1,
        backgroundColor: 'black',
        alignSelf: 'stretch',
    },
    infoContainer: {
        position: 'absolute',
        top: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 10,
        flexWrap: 'wrap', // Allow wrapping if content is too wide
        gap: 10, // Add space between boxes
    },
    box: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
        alignItems: 'flex-start', // Changed from center to flex-start
        minWidth: 120, // Add minimum width
    },
    boxText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5, // Add space below the title
    },
    suggestionText: {
        color: 'white',
        fontSize: 14,
        marginTop: 2,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
    },
    button: {
        borderRadius: 50,
        width: 50,
        height: 50,
    },
});

export default App;
