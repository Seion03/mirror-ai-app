import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { auth, db } from '../../scripts/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';

const SignupPage = () => {
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    age: '',
    experience: '',
    goldTrophies: 0,
    silverTrophies: 0,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    // ... [Existing handleSignup logic remains unchanged]
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await addDoc(collection(db, 'users'), {
        name: name,
        email: email,
        userId: userId,
        profile: profile,
      });

      setUser({ name, email }); // Store user in context
      Alert.alert('Success', 'Account created successfully!');
      router.push('/index');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Signup Error', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a3a7c', '#2948ff']}
      style={styles.gradient}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>JOIN THE CHALLENGE</Text>
            <Text style={styles.subtitle}>Create your fitness journey account</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Your Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Create Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="shield" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255,255,255,0.7)"
                secureTextEntry
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            ) : (
              <TouchableOpacity onPress={handleSignup}>
                <LinearGradient
                  colors={['#FF416C', '#FF4B2B']}
                  style={styles.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>START YOUR JOURNEY</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    letterSpacing: 1,
  },
  formContainer: {
    width: '85%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  icon: {
    marginRight: 15,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.5,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  loader: {
    marginTop: 20,
  }
});

export default SignupPage;