import { useState } from 'react';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Clipboard,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../scripts/firebase';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RoomPage = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('main');
  const [roomCode, setRoomCode] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');
  const [numPersons, setNumPersons] = useState('');
  const [workout, setWorkout] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [showWorkoutSuggestions, setShowWorkoutSuggestions] = useState(false);
  const [workoutSuggestions] = useState(['Push-up', 'Pull-up', 'Squats']);

  const generateRoomCode = async () => {
    if (numPersons && workout) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('Error', 'User is not authenticated');
          return;
        }

        const code = `${Math.floor(1000 + Math.random() * 9000)}`;
        setRoomCode(code);
        setCopiedMessage('');
  
        await addDoc(collection(db, 'rooms'), {
          roomCode: code,
          numPersons: parseInt(numPersons, 10),
          workout: workout.trim(),
          createdAt: new Date(),
          participants: [],
          creatorId: currentUser.uid,
        });
      } catch (error) {
        console.error('Error creating room:', error);
        Alert.alert('Error', 'Failed to create room. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select both number of persons and workout type!');
    }
  };

  const copyToClipboard = () => {
    if (roomCode) {
      Clipboard.setString(roomCode);
      setCopiedMessage('Copied to Clipboard!');
      Alert.alert('Success', 'Code copied to clipboard!');
    } else {
      Alert.alert('Error', 'No room code to copy!');
    }
  };

  const handlePersonSelection = (person) => {
    setNumPersons(person);
    setShowPersonSuggestions(false);
  };

  const handleWorkoutSelection = (workoutType) => {
    setWorkout(workoutType);
    setShowWorkoutSuggestions(false);
  };

  const validateJoinRoomCode = async () => {
    if (joinRoomCode.trim() === '') {
      Alert.alert('Error', 'Please enter a valid room code!');
      return;
    }
  
    try {
      const q = query(collection(db, 'rooms'), where('roomCode', '==', joinRoomCode.trim()));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert('Error', 'Invalid room code!');
      } else {
        const roomData = querySnapshot.docs[0].data();
        if (roomData.participants.length >= roomData.numPersons) {
          Alert.alert('Error', 'Room is full!');
        } else {
          Alert.alert('Success', `You have joined room: ${joinRoomCode}`);
          router.push({ pathname: '/inroom', params: { roomCode: joinRoomCode } });
        }
      }
    } catch (error) {
      console.error('Error validating room code:', error);
      Alert.alert('Error', 'Failed to validate room code. Please try again.');
    }
  };

  const renderPersonSuggestions = () => {
    const persons = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
    return (
      <Modal transparent visible={showPersonSuggestions} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPersonSuggestions(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            <FlatList
              data={persons}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.suggestionButton}
                  onPress={() => handlePersonSelection(item)}
                >
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const renderWorkoutSuggestions = () => (
    <Modal transparent visible={showWorkoutSuggestions} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowWorkoutSuggestions(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          {workoutSuggestions.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={styles.suggestionButton}
              onPress={() => handleWorkoutSelection(item)}
            >
              <Text style={styles.suggestionItem}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={['#1a2a6c', '#2a3a7c']} style={styles.container}>
      <View style={styles.overlay}>
        {currentView === 'main' && (
          <View style={styles.mainContainer}>
            <Text style={styles.headerText}>
              <Ionicons name="fitness" size={32} color="#FFFFFF" /> WORKOUT TOGETHER
            </Text>
            <Text style={styles.subHeaderText}>Join or create a workout room</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.mainButton}
                onPress={() => setCurrentView('createRoom')}
              >
                <LinearGradient
                  colors={['#FF416C', '#FF4B2B']}
                  style={styles.gradientButton}
                >
                  <Ionicons name="add-circle" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonTitle}>Create Room</Text>
                  <Text style={styles.buttonSubtext}>Start a new workout session</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainButton}
                onPress={() => setCurrentView('joinRoom')}
              >
                <LinearGradient
                  colors={['#4776E6', '#8E54E9']}
                  style={styles.gradientButton}
                >
                  <Ionicons name="enter" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonTitle}>Join Room</Text>
                  <Text style={styles.buttonSubtext}>Enter an existing session</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {currentView === 'createRoom' && (
          <View style={styles.createRoomContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentView('main')}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerText}>
              <Ionicons name="create" size={28} color="#FFFFFF" /> CREATE ROOM
            </Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowPersonSuggestions(true)}
            >
              <Ionicons name="people" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <Text style={styles.inputText}>
                {numPersons || 'Select Number of Persons'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowWorkoutSuggestions(true)}
            >
              <Ionicons name="barbell" size={20} color="#FFFFFF" style={styles.inputIcon} />
              <Text style={styles.inputText}>{workout || 'Select Workout'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={generateRoomCode}
            >
              <LinearGradient
                colors={['#FF416C', '#FF4B2B']}
                style={styles.gradientButton}
              >
                <Ionicons name="key" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Create Room Code</Text>
              </LinearGradient>
            </TouchableOpacity>

            {roomCode !== '' && (
              <View style={styles.codeContainer}>
                <Text style={styles.roomCodeLabel}>Your Room Code</Text>
                <Text style={styles.roomCodeText}>{roomCode}</Text>

                <TouchableOpacity 
                  style={styles.copyButton} 
                  onPress={copyToClipboard}
                >
                  <Ionicons name="copy" size={18} color="#FFFFFF" style={styles.copyIcon} />
                  <Text style={styles.copyButtonText}>Copy Code</Text>
                </TouchableOpacity>

                {copiedMessage !== '' && (
                  <>
                    <Text style={styles.copiedMessage}>{copiedMessage}</Text>
                    <TouchableOpacity
                      style={styles.enterRoomButton}
                      onPress={() =>
                        router.push({
                          pathname: '/inroom',
                          params: { workout, roomCode },
                        })
                      }
                    >
                      <LinearGradient
                        colors={['#4776E6', '#8E54E9']}
                        style={styles.gradientButton}
                      >
                        <Ionicons name="enter" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Enter Room</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {renderPersonSuggestions()}
            {renderWorkoutSuggestions()}
          </View>
        )}

        {currentView === 'joinRoom' && (
          <View style={styles.joinRoomContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentView('main')}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerText}>
              <Ionicons name="enter" size={28} color="#FFFFFF" /> JOIN ROOM
            </Text>
            <Text style={styles.inputPrompt}>Enter Room Code:</Text>
            
            <TextInput
              style={styles.inputField}
              placeholder="Enter 4-digit code"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={joinRoomCode}
              onChangeText={setJoinRoomCode}
              keyboardType="number-pad"
              maxLength={4}
            />

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={validateJoinRoomCode}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                style={styles.gradientButton}
              >
                <Ionicons name="enter" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Join Room</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  createRoomContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  joinRoomContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: '85%',
    height: 100,
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientButton: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputBox: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputPrompt: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.8,
  },
  inputField: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButton: {
    width: '85%',
    height: 60,
    marginVertical: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  codeContainer: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  roomCodeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
  roomCodeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 5,
    marginVertical: 10,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  copyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  copiedMessage: {
    color: '#4CAF50',
    fontSize: 14,
    marginVertical: 5,
  },
  enterRoomButton: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#1a2a6c',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  suggestionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionItem: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  copyIcon: {
    marginRight: 5,
  },
});

export default RoomPage;