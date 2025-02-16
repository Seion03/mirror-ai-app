    import React, { useRef, useState } from 'react';
    import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
    import { ApiVideoLiveStreamMethods, ApiVideoLiveStreamView } from '@api.video/react-native-livestream';

    const App = () => {
        const ref = useRef<ApiVideoLiveStreamMethods | null>(null);
        const [streaming, setStreaming] = useState(false);

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
                        <Text style={styles.boxText}>✅ Correct: 0</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxText}>❌ Incorrect: 0</Text>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxText}>💡 Suggestions</Text>
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
                                    ref.current?.startStreaming('test', 'rtmp://192.168.107.249/live');
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
        },
        box: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
        },
        boxText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
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
