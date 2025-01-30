import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {ApiVideoLiveStreamMethods, ApiVideoLiveStreamView} from '@api.video/react-native-livestream';

const App = () => {
    const ref = React.useRef<ApiVideoLiveStreamMethods | null>(null);
    const [streaming, setStreaming] = useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <ApiVideoLiveStreamView
                style={{ flex: 1, backgroundColor: 'black', alignSelf: 'stretch' }}
                ref={ref}
                camera="back"
                enablePinchedZoom={true}
                video={{
                    fps: 30,
                    resolution: '720p', // Alternatively, you can specify the resolution in pixels: { width: 1280, height: 720 }
                    bitrate: 2*1024*1024, // # 2 Mbps
                    gopDuration: 1, // 1 second
                }}
                audio={{
                    bitrate: 128000,
                    sampleRate: 44100,
                    isStereo: true,
                }}
                isMuted={false}
                onConnectionSuccess={() => {
                    //do what you want
                }}
                onConnectionFailed={(e) => {
                    //do what you want
                }}
                onDisconnect={() => {
                    //do what you want
                }}
            />
            <View style={{ position: 'absolute', bottom: 40 }}>
                <TouchableOpacity
                    style={{
                        borderRadius: 50,
                        backgroundColor: streaming ? 'red' : 'white',
                        width: 50,
                        height: 50,
                    }}
                    onPress={() => {
                        if (streaming) {
                            ref.current?.stopStreaming();
                            setStreaming(false);
                        } else {
                            try {
                                ref.current?.startStreaming('test','rtmp://192.168.137.1/live');
                                setStreaming(true);
                            }
                            catch (e) {
                                console.error(e);
                            }

                        }
                    }}
                />
            </View>
        </View>
    );
}

export default App;