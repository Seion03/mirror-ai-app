import { StyleSheet } from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
} from 'react-native-vision-camera';
import { useEffect, useRef } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { io, Socket } from "socket.io-client";

import {runOnJS} from "react-native-reanimated";


function PermissionsPage() {
    return null;
}
function NoCameraDeviceError() {
    return null;
}

export default function HomeScreen() {
    const device = useCameraDevice('back');
    const { hasPermission } = useCameraPermission();
    const { resize } = useResizePlugin();

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        askPermission();

        const socket = io('http://192.168.1.4:8765');
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to server');
        });
        // Replace with your server IP


        return () => {
            socket.disconnect();// Clean up WebSocket connection when component unmounts
        };
    }, []);

    const askPermission = async () => {
        await Camera.requestCameraPermission();
        await Camera.requestMicrophonePermission();
    };

    if (!hasPermission) return <PermissionsPage />;
    if (!device) return <NoCameraDeviceError />;

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';

        // Resize the frame
        const resized = resize(frame, {
            scale: {
                width: 192,
                height: 192,
            },
            pixelFormat: 'rgb',
            dataType: 'uint8',
        });

        // Convert the resized frame to a Uint8Array (raw RGB bytes)
        const byteArray = new Uint8Array(resized);

        // Call a JS function using runOnJS
        runOnJS(() => {
            console.log('Frame processed and sending to server');

            // Send the frame data to the server via WebSocket
            if (socketRef.current ) {
                socketRef.current.emit('frame', byteArray);
            } else {
                console.warn('Socket is not connected.');
            }
        })();
    }, []);


    const sendToServer = (byteArray: Uint8Array) => {
        // Ensure socket is connected
        if (socketRef.current ) {
            socketRef.current.emit('frame', byteArray);
        } else {
            console.warn('Socket is not connected.');
        }
    };

    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            // Adjust FPS if needed
        />
    );
}
