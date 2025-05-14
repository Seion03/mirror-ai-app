import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, query, where, getDocs, DocumentData, updateDoc, arrayUnion, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../scripts/firebase';
import { getAuth } from 'firebase/auth';
import { useUser } from '../../context/UserContext';

const InRoomTab = () => {
  const router = useRouter();
  const { roomCode, userScore } = useLocalSearchParams();
  const [roomData, setRoomData] = useState<DocumentData | null>(null);
  const [participants, setParticipants] = useState<Array<{ id: number; [key: string]: any }>>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [isCreator, setIsCreator] = useState(false);
  const [roomEnded, setRoomEnded] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomCode) {
        console.error('Room code is undefined');
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error('User is not authenticated');
          setLoading(false);
          return;
        }

        const userName = user.name || 'Anonymous';

        const roomQuery = query(
          collection(db, 'rooms'),
          where('roomCode', '==', roomCode)
        );
        const roomSnapshot = await getDocs(roomQuery);

        if (!roomSnapshot.empty) {
          const roomDoc = roomSnapshot.docs[0];
          const roomData = roomDoc.data();
          roomData.id = roomDoc.id;
          setRoomData(roomData);

          if (roomData.creatorId === currentUser.uid) {
            setIsCreator(true);
          }

          const roomRef = doc(db, 'rooms', roomDoc.id);
          await updateDoc(roomRef, {
            participants: arrayUnion({ name: userName, score: userScore || 0 })
          });

          onSnapshot(roomRef, (doc) => {
            const updatedRoomData = doc.data();
            if (updatedRoomData) {
              setParticipants(updatedRoomData.participants);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomCode, userScore, user.name]);

  const exitRoom = async () => {
    if (!roomData || !roomData.id) return;

    try {
      const roomRef = doc(db, 'rooms', roomData.id);
      await updateDoc(roomRef, {
        participants: []
      });

      Alert.alert('Room Closed', 'The room has been closed by the creator.');
      router.push('/room');
    } catch (error) {
      console.error('Error exiting room:', error);
    }
  };

  const endRoom = async () => {
    if (!roomData || !roomData.id) return;

    try {
      const roomRef = doc(db, 'rooms', roomData.id);
      await updateDoc(roomRef, {
        participants: []
      });

      Alert.alert('Room Ended', 'The room has been ended by the creator.');
      router.push('/room');
    } catch (error) {
      console.error('Error ending room:', error);
    }
  };

  useEffect(() => {
    const checkRoomStatus = async () => {
      if (!roomCode || roomEnded) return;

      try {
        const roomQuery = query(
          collection(db, 'rooms'),
          where('roomCode', '==', roomCode)
        );
        const roomSnapshot = await getDocs(roomQuery);

        if (!roomSnapshot.empty) {
          const roomDoc = roomSnapshot.docs[0];
          const roomData = roomDoc.data();

          if (roomData.participants.length === 0) {
            setRoomEnded(true);
            Alert.alert('Room Ended', 'The room has been ended by the creator.');
            router.push('/room');
          }
        }
      } catch (error) {
        console.error('Error checking room status:', error);
      }
    };

    const interval = setInterval(checkRoomStatus, 5000);

    return () => clearInterval(interval);
  }, [roomCode, roomEnded]);

  const navigateBack = () => {
    router.push('/room');
  };

  const startWorkout = () => {
    // Navigate to the exercise page with room code
    router.push({
      pathname: '/(workouts)/index1' as any,
      params: { roomCode }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#1a2a6c', '#2a3a7c']}
        style={styles.gradientContainer}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={[styles.iconButton, styles.backButton]} 
            onPress={navigateBack}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>

          {isCreator && (
            <View style={styles.creatorButtonsContainer}>
              <TouchableOpacity 
                style={[styles.iconButton, styles.startButton]} 
                onPress={startWorkout}
              >
                <Text style={styles.startButtonText}>START</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconButton, styles.endButton]} 
                onPress={endRoom}
              >
                <Text style={styles.buttonText}>END</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.iconButton, styles.exitButton]} 
                onPress={exitRoom}
              >
                <Text style={styles.buttonText}>EXIT</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.headerContainer}>
            <Text style={styles.workoutTitle}>
              {roomData ? roomData.workout : 'Loading...'}
            </Text>
            <LinearGradient
              colors={['#4776E6', '#8E54E9']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.roomCodeContainer}
            >
              <Text style={styles.roomCodeText}>Room Code: {roomCode}</Text>
            </LinearGradient>
          </View>

          <View style={styles.leaderboardWrapper}>
            <Text style={styles.leaderboardTitle}>LEADERBOARD</Text>
            <ScrollView style={styles.leaderboardContainer}>
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.leaderboardHeader}
              >
                <Text style={[styles.leaderboardText, styles.headerCol]}>RANK</Text>
                <Text style={[styles.leaderboardText, styles.headerCol]}>NAME</Text>
                <Text style={[styles.leaderboardText, styles.headerCol]}>SCORE</Text>
              </LinearGradient>
              
              {loading ? (
                <Text style={styles.statusText}>Loading participants...</Text>
              ) : participants.length > 0 ? (
                participants.map((person, index) => (
                  <View key={index} style={styles.leaderboardRow}>
                    <Text style={[styles.participantText, styles.rowCol]}>#{index + 1}</Text>
                    <Text style={[styles.participantText, styles.rowCol]}>{person.name}</Text>
                    <Text style={[styles.participantText, styles.rowCol]}>{person.score || 0}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.statusText}>No participants yet</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4776E6',
  },
  creatorButtonsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  startButton: {
    backgroundColor: '#32CD32',
  },
  endButton: {
    backgroundColor: '#FF416C',
  },
  exitButton: {
    backgroundColor: '#FF4B2B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerContainer: {
    marginTop: 100,
    alignItems: 'center',
    gap: 15,
  },
  workoutTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  roomCodeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  roomCodeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  leaderboardWrapper: {
    marginTop: 30,
    flex: 1,
  },
  leaderboardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  leaderboardContainer: {
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  leaderboardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerCol: {
    flex: 1,
    textAlign: 'center',
  },
  leaderboardRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  participantText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
  rowCol: {
    flex: 1,
    textAlign: 'center',
  },
  statusText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default InRoomTab;
